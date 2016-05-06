import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Store} from '@ngrx/store';
import {AuthActions} from './reducers/auth';
import {Toast2Service} from '../toast2/Toast2Service';
import {BASE_URL} from '../util/ApiHttp';

const URL = '/auth';

@Injectable()
export class AuthService {

  constructor(private http: Http, private store: Store<any>,
              private toast2Service: Toast2Service) {
  }

  promptForAuth() {
    this.store.dispatch({type: AuthActions.SHOW_AUTH_PROMPT});
  }

  logIn(username: string, password: string) {
    this.http.post(BASE_URL + URL, JSON.stringify({username: username, password: password}),
        {headers: new Headers({'Content-Type': 'application/json'})})
      .map(res => res.json())
      .subscribe(
        data => this.store.dispatch(
          {type: AuthActions.AUTHENTICATED, payload: {token: data.token}}),
        error => this.toast2Service.error('Invalid username/password combination'));
  }

  logOut() {
    this.store.dispatch({type: AuthActions.LOGOUT});
  }

}
