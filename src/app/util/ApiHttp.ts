import {Injectable} from 'angular2/core';
import {Http, RequestOptionsArgs, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Toast2Service} from '../toast2/Toast2Service';
import {Toast2Type} from '../toast2/toast2';

@Injectable()
export class ApiHttp {
  constructor(private http: Http, private toast2Service: Toast2Service) {
  }

  private intercept(options?: RequestOptionsArgs): RequestOptionsArgs {
    let _options: RequestOptionsArgs = options || {};
    let headers: Headers = _options.headers || new Headers();
    headers.append('X-Some-Header', 'some value');
    return Object.assign({}, _options, {headers: headers});
  }

  private errorHandler = (error: any, source: Observable<Response>,
                          caught: Observable<any>): Observable<Response> => {
    this.toast2Service.display('Error ' + error.status, Toast2Type.ERROR);
    return Observable.empty();
  };

  get(url:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.http.get(url, this.intercept(options)).catch(this.errorHandler);
  }

  post(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.http.post(url, body, this.intercept(options)).catch(this.errorHandler);
  }

  put(url:string, body:string, options?:RequestOptionsArgs):Observable<Response> {
    return this.http.put(url, body, this.intercept(options)).catch(this.errorHandler);
  }

  delete (url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.delete(url, this.intercept(options)).catch(this.errorHandler);
  }
}
