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

class Request {
  constructor(public method: RequestMethod, public url: string, public body?: string,
              public options?: RequestOptionsArgs) {}
}

class RequestBuffer {
  requests: {origRequest: Request, observer: Subscriber<Response>}[] = [];

  append(origRequest: Request, observer: Subscriber<Response>) {
    this.requests.push({
      origRequest: origRequest, observer: observer
    });
  }

  retry() {
    this.requests.forEach(request => {
      request.observer.next(new Response(new ResponseOptions({
        body: [{id:1, title:'n1', text:'nnn'}]
      })));
      request.observer.complete();
    });
  }
}

@Injectable()
export class ApiHttp {
  authState: AuthState;
  requestBuffer: {origRequest: Request, observer: Subscriber<Response>}[] = [];

  constructor(private http: Http, private toast2Service: Toast2Service,
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

  private intercept(method: RequestMethod, options?: RequestOptionsArgs): RequestOptionsArgs {
    let _options: RequestOptionsArgs = options || {};
    let headers: Headers = _options.headers || new Headers();
    headers.append('X-Some-Header', 'some value');
    if (this.authState && this.authState.authenticated) {
      headers.append('Authorization', 'Bearer ' + this.authState.userData.token);
    }
    if (method === RequestMethod.Post || method === RequestMethod.Put) {
      headers.append('Content-Type', 'application/json');
    }
    return Object.assign({}, _options, {headers: headers});
  }

  private errorHandler = (request: Request) => {
    return (error: any, source: Observable<Response>,
            caught: Observable<any>): Observable<Response> => {
      return Observable.create((observer: Subscriber<Response>) => {
        //TODO change to 401
        if (error.status === 404) {
          this.appendToRequestBuffer(request, observer);
          this.authService.promptForAuth();
        } else {
          this.toast2Service.display('Error ' + error.status, Toast2Type.ERROR);
        }
      });
    };
  };

  doRequest(request: Request): Observable<Response> {
    let response;
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
    return response.catch(this.errorHandler(request));
  }

  get(url:string, options?:RequestOptionsArgs):Observable<Response> {
    let request = new Request(RequestMethod.Get, url, undefined, options);
    return this.doRequest(request);
  }

  post(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    let request = new Request(RequestMethod.Post, url, body, options);
    return this.doRequest(request);
  }

  put(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    let request = new Request(RequestMethod.Put, url, body, options);
    return this.doRequest(request);
  }

  delete (url: string, options?: RequestOptionsArgs): Observable<Response> {
    let request = new Request(RequestMethod.Delete, url, undefined, options);
    return this.doRequest(request);
  }

  appendToRequestBuffer(origRequest: Request, observer: Subscriber<Response>) {
    this.requestBuffer.push({
      origRequest: origRequest, observer: observer
    });
  }

  retryRequestsInBuffer() {
    this.requestBuffer.forEach(request => {
      this.doRequest(request.origRequest).subscribe((response: Response) => {
        request.observer.next(response);
        request.observer.complete();
      });
    });
  }

}
