/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

import {Home} from './home';
import {AppState} from './app.service';
import {RouterActive} from './router-active';
import {NotesComponent} from './notes/NotesComponent';
import {Toast2Component} from './toast2/Toast2Component';
import {AuthPrompt} from './auth/AuthPrompt';
import {Spinner} from './util/Spinner.ts';
import {AuthService} from './auth/AuthService';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [],
  providers: [ FORM_PROVIDERS ],
  directives: [ RouterActive, Toast2Component, AuthPrompt, Spinner ],
  encapsulation: ViewEncapsulation.None,
  styles: [require('./app.scss')],
  template: `
    <md-toolbar color="primary">
      <span>{{ name }}</span>
      <nav>
        <ul>
          <li router-active>
            <a [routerLink]=" ['Index'] ">Index</a>
          </li>
          |
          <li router-active>
            <a [routerLink]=" ['Home'] ">Home</a>
          </li>
          |
          <li router-active>
            <a [routerLink]=" ['Notes'] ">Notes</a>
          </li>
          |
          <li router-active>
            <a [routerLink]=" ['About'] ">About</a>
          </li>
          |
          <li>
            <a (click)="logIn()">Login</a>
          </li>
        </ul>
      </nav>
    </md-toolbar>

    <main>
      <auth-prompt></auth-prompt>
      <toast2></toast2>
      <spinner></spinner>
      <router-outlet></router-outlet>
    </main>

    <pre>this.appState.state = {{ appState.state | json }}</pre>

    <footer>
      WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a>
      <div>
        <img [src]="angularclassLogo" width="10%">
      </div>
    </footer>
  `
})
@RouteConfig([
  { path: '/',      name: 'Index', component: Home, useAsDefault: true },
  { path: '/home',  name: 'Home',  component: Home },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  { path: '/about', name: 'About', loader: () => require('es6-promise!./about')('About') },
  { path: '/notes', component: NotesComponent, name: 'Notes'}
])
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(private authService: AuthService, public appState: AppState) {}

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

  logIn() {
    this.authService.promptForAuth();
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
