import {Reducer, Action} from '@ngrx/store';

const STATE_AUTH_KEY: string = 'state.auth';

export class AuthActions {
  static SHOW_AUTH_PROMPT = 'showAuthPrompt';
  static AUTHENTICATED = 'authenticated';
  static LOGOUT = 'logout';
}

export interface AuthState {
  showAuthPrompt: boolean;
  authenticated: boolean;
  userData: any;
}

const initialAuthState: AuthState = sessionStorage[STATE_AUTH_KEY] ?
  {
    showAuthPrompt: false,
    authenticated: true,
    userData: {token: sessionStorage[STATE_AUTH_KEY]}
  } : {
    showAuthPrompt: false,
    authenticated: false,
    userData: undefined
  };

export const auth: Reducer<AuthState> = (state: AuthState = initialAuthState, action: Action) => {
  switch(action.type) {
    case AuthActions.SHOW_AUTH_PROMPT:
      return Object.assign({}, state, {showAuthPrompt: true, authenticated: false});
    case AuthActions.AUTHENTICATED:
      sessionStorage[STATE_AUTH_KEY] = action.payload.token;
      return Object.assign({}, state, {
        showAuthPrompt: false,
        authenticated: true,
        userData: action.payload
        });
    case AuthActions.LOGOUT:
      sessionStorage.removeItem(STATE_AUTH_KEY);
      return Object.assign({}, state, {
        showAuthPrompt: false,
        authenticated: false,
        userData: undefined
      });
    default:
      return state
  }
};
