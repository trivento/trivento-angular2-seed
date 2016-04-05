/*
 * Providers provided by Angular
 */
import * as ngCore from 'angular2/core';
import * as browser from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS, RequestOptions, XHRConnection} from 'angular2/http';
import {App} from './app/app';
import {provideStore} from '@ngrx/store';
import {notesReducer, selectedNoteReducer} from './app/notes/notesReducers';
import {NoteService} from "./app/notes/NoteService";
import {toast2} from './app/toast2/toast2';
import {Toast2Service} from './app/toast2/Toast2Service';
import {ApiHttp} from './app/util/ApiHttp';
import {auth} from './app/auth/reducers/auth';
import {SpinnerService} from './app/util/Spinner';
import {spinner} from './app/util/Spinner.ts';
import {AuthService} from './app/auth/AuthService';

var css = require('./assets/css/test.css');

/*
 * App Environment Providers
 * providers that only live in certain environment
 */
const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  ngCore.enableProdMode();
  ENV_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS_PROD_MODE);
} else {
  ENV_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS);
}

/*
 * App Component
 * our top level component that holds all of our components
 */

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main() {
  return browser.bootstrap(App, [
    ...ENV_PROVIDERS,
    ...HTTP_PROVIDERS,
    ...ROUTER_PROVIDERS,
    ngCore.provide(LocationStrategy, { useClass: HashLocationStrategy }),
    Toast2Service,
    SpinnerService,
    ApiHttp,
    AuthService,
    NoteService,
    provideStore({toast2, spinner, auth, notesReducer, selectedNoteReducer})
  ])
  .catch(err => console.error(err));
}


/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */


/*
 * Hot Module Reload
 * experimental version by @gdi2290
 */

function bootstrapDomReady() {
  // bootstrap after document is ready
  return document.addEventListener('DOMContentLoaded', main);
}

if ('development' === process.env.ENV) {
  // activate hot module reload
  if (process.env.HMR) {
    if (document.readyState === 'complete') {
      main();
    } else {
      bootstrapDomReady();
    }
    module.hot.accept();
  } else {
    bootstrapDomReady();
  }
} else {
  bootstrapDomReady();
}
