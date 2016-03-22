import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component} from 'angular2/core';
import {AuthState} from './reducers/auth';
import {AuthLogin} from './AuthLogin';
import {AuthService} from './AuthService';

@Component({
  selector: 'auth-prompt',
  directives: [AuthLogin],
  template: `
    <auth-login [authState]="authState | async" (loggedIn)="logIn($event)"></auth-login>
  `
})
export class AuthPrompt {

  authState: Observable<AuthState>;

  constructor(private store: Store<AuthState>, private authService: AuthService) {
    this.authState = store.select('auth');
  }

  logIn(authData: {username: string, password: string}) {
    this.authService.logIn(authData.username, authData.password);
  }

}
