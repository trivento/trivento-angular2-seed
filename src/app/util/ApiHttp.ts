import {Injectable} from 'angular2/core';
import {Http, RequestOptionsArgs, Response, Headers, RequestMethod} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {Toast2Service} from '../toast2/Toast2Service';
import {Toast2Type} from '../toast2/toast2';
import {AuthService} from '../auth/AuthService';
import {AuthState} from '../auth/reducers/auth';
import {ResponseOptions} from 'angular2/http';
import {Subscriber} from 'rxjs/Subscriber';
import {SpinnerService} from './Spinner';

/**
 * Stores an http request.
 */
class Request {
  constructor(public method: RequestMethod, public url: string, public body?: string,
              public options?: RequestOptionsArgs) {}
}

/**
 * Wrapper for http requests that allows for intercepting
 * requests, responses and error responses. Upon a 401 error
 * response an ngrx event is dispatched prompting the user
 * to log in. After having been successfully authenticated,
 * the original requests will automatically be retried.
 */
@Injectable()
export class ApiHttp {
  authState: AuthState;
  requestBuffer: {origRequest: Request, observer: Subscriber<Response>}[] = [];

  /**
   * Subscribe to authentication events. On successful
   * authentication, any buffered requests will be
   * retried.
   */
  constructor(private http: Http, private toast2Service: Toast2Service,
              private spinner: SpinnerService,
              private authService: AuthService, private store: Store<AuthState>) {
    let authObservable = store.select('auth');
    authObservable.subscribe((authState: AuthState) => {
      this.authState = authState;
    });
    authObservable.delay(1).subscribe(() => {
      if (this.authState.authenticated) {
        this.retryRequestsInBuffer();
      }
    });
  }

  /**
   * Intercepts any http request to add an authorization
   * header (if user is logged in) and any other necessary
   * headers.
   */
  private intercept(method: RequestMethod, options?: RequestOptionsArgs): RequestOptionsArgs {
    let _options: RequestOptionsArgs = options || {};
    let headers: Headers = _options.headers || new Headers();
    if (this.authState && this.authState.authenticated) {
      headers.append('Authorization', 'Bearer ' + this.authState.userData.token);
    }
    if (method === RequestMethod.Post || method === RequestMethod.Put) {
      headers.append('Content-Type', 'application/json');
    }
    return Object.assign({}, _options, {headers: headers});
  }

  /**
   * Handles an http error response. On a 401 response, an ngrx
   * event will be dispatched asking for authentication and the
   * original request is buffered so it can be retried later on.
   */
  private errorHandler = (request: Request) => {
    return (error: any, source: Observable<Response>,
            caught: Observable<any>): Observable<Response> => {
      return Observable.create((observer: Subscriber<Response>) => {
        if (error.status === 401) {
          this.appendToRequestBuffer(request, observer);
          this.authService.promptForAuth();
        } else {
          this.toast2Service.display('Error ' + error.status, Toast2Type.ERROR);
          observer.complete();
        }
      });
    };
  };

  /**
   * Sends the specified http request to the http service,
   * intercepting its response.
   */
  doRequest(request: Request): Observable<Response> {
    let response;
    this.spinner.start();
    switch(request.method) {
      case RequestMethod.Get:
        response = this.http.get(request.url,
          this.intercept(request.method, request.options));
        break;
      case RequestMethod.Post:
        response = this.http.post(request.url, request.body,
          this.intercept(request.method, request.options));
        break;
      case RequestMethod.Put:
        response = this.http.put(request.url, request.body,
          this.intercept(request.method, request.options));
        break;
      case RequestMethod.Delete:
        response = this.http.delete(request.url,
          this.intercept(request.method, request.options));
        break;
    }
    return response
      .catch(this.errorHandler(request))
      .finally(() => {
        this.spinner.stop();
      });
  }

  /**
   * Sends a GET request, intercepting its response.
   */
  get(url:string, options?:RequestOptionsArgs):Observable<Response> {
    let request = new Request(RequestMethod.Get, url, undefined, options);
    return this.doRequest(request);
  }

  /**
   * Sends a POST request, intercepting its response.
   */
  post(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    let request = new Request(RequestMethod.Post, url, body, options);
    return this.doRequest(request);
  }

  /**
   * Sends a PUT request, intercepting its response.
   */
  put(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    let request = new Request(RequestMethod.Put, url, body, options);
    return this.doRequest(request);
  }

  /**
   * Sends a DELETE request, intercepting its response.
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    let request = new Request(RequestMethod.Delete, url, undefined, options);
    return this.doRequest(request);
  }

  /**
   * Appends an http request to the request buffer, from where
   * it can later be fetched to retry it.
   */
  appendToRequestBuffer(origRequest: Request, observer: Subscriber<Response>) {
    this.requestBuffer.push({
      origRequest: origRequest, observer: observer
    });
  }

  /**
   * Retries all http requests present in the request buffer.
   */
  retryRequestsInBuffer() {
    this.requestBuffer.forEach(request => {
      this.doRequest(request.origRequest).subscribe((response: Response) => {
        request.observer.next(response);
        request.observer.complete();
      });
    });
  }

}
