// App
export * from './app.component';
export * from './app.service';

import {provideStore} from '@ngrx/store';
import {notesReducer, selectedNoteReducer} from './notes/notesReducers';
import {NoteService} from './notes/NoteService';
import {toast2} from './toast2/toast2';
import {Toast2Service} from './toast2/Toast2Service';
import {ApiHttp} from './util/ApiHttp';
import {auth} from './auth/reducers/auth';
import {AuthService} from './auth/AuthService';
import {spinner} from './util/Spinner.ts';
import {SpinnerService} from './util/Spinner';

import {AppState} from './app.service';

// Application wide providers
export const APP_PROVIDERS = [
  AppState,
  Toast2Service,
  SpinnerService,
  ApiHttp,
  AuthService,
  NoteService,
  provideStore({toast2, spinner, auth, notesReducer, selectedNoteReducer})
];
