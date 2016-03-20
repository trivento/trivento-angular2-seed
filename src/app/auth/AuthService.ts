import {Injectable} from 'angular2/core';
import {Store} from '@ngrx/store';
import {AuthActions} from './reducers/auth';
import {Toast2Service} from '../toast2/Toast2Service';

@Injectable()
export class AuthService {

  constructor(private store: Store<any>, private toast2Service: Toast2Service) {
  }

  promptForAuth() {
    this.store.dispatch({type: AuthActions.SHOW_AUTH_PROMPT});
  }

  logIn(username: string, password: string) {
    //TODO replace with backend check
    if (username === password) {
      this.store.dispatch({type: AuthActions.AUTHENTICATED, payload: {token: 'sample-token'}});
    } else {
      this.toast2Service.error('Invalid username/password combination');
    }
  }
}
