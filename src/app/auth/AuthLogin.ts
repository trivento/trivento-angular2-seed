import {Store} from '@ngrx/store';
import {Component} from 'angular2/core';
import {AuthState} from './reducers/auth';
import {Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'auth-login',
  template: `
    <div *ngIf="authState.showAuthPrompt" class="auth-login-container">
      <div class="auth-login">
        <h3>Login</h3>
        <div>
          <label for="auth-username">Username</label>
          <input type="text" id="auth-username" #username>
        </div>
        <div>
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" #password>
        </div>
        <div>
          <button (click)="logIn(username, password)">
            Login
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-login-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(1, 1, 1, 0.8);
      z-index: 9999;
    }
    .auth-login {
      margin: auto auto;
      background-color: #ddd;
      width: 50%;
      margin-top: 25%;
      padding: 8px;
    }
  `]
})
export class AuthLogin {
  @Input() authState: AuthState;
  @Output() loggedIn = new EventEmitter();

  logIn(username, password) {
    this.loggedIn.emit({username: username.value, password: password.value});
  }
}
