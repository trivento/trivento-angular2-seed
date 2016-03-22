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
  requests: {url: string, observer: Subscriber<Response>}[] = [];

  append(url: string, observer: Subscriber<Response>) {
    this.requests.push({
      url: url, observer: observer
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
  requestBuffer = new RequestBuffer();

  constructor(private http: Http, private toast2Service: Toast2Service,
              private authService: AuthService, private store: Store<AuthState>) {
    let authObservable = store.select('auth');
    authObservable.subscribe((authState: AuthState) => {
      this.authState = authState;
    });
    authObservable.delay(1).subscribe(() => {
      if (this.authState.authenticated) {
        this.requestBuffer.retry();
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

  private errorHandler = (error: any, source: Observable<Response>,
                          caught: Observable<any>): Observable<Response> => {
    return Observable.create((observer: Subscriber<Response>) => {
      //TODO change to 401
      if (error.status === 404) {
        //TODO include original request?
        this.requestBuffer.append('http://localhost:3100/note', observer);
        this.authService.promptForAuth();
      } else {
        this.toast2Service.display('Error ' + error.status, Toast2Type.ERROR);
      }
    });
  };

  //doRequest(request: Request): Observable<Response> {
  //  switch(request.method) {
  //    case RequestMethod.Get:
  //    case RequestMethod.Post:
  //    case RequestMethod.Put:
  //    case RequestMethod.Delete:
  //  }
  //}

  get(url:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.http.get(url, this.intercept(RequestMethod.Get, options))
      .catch(this.errorHandler);
  }

  post(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.http.post(url, body, this.intercept(RequestMethod.Post, options))
      .catch(this.errorHandler);
  }

  put(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.http.put(url, body, this.intercept(RequestMethod.Put, options))
      .catch(this.errorHandler);
  }

  delete (url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.delete(url, this.intercept(RequestMethod.Delete, options))
      .catch(this.errorHandler);
  }
}
