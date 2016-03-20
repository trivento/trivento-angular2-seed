import {Reducer, Action} from '@ngrx/store';

export class AuthActions {
  static SHOW_AUTH_PROMPT = 'showAuthPrompt';
  static AUTHENTICATED = 'authenticated';
}

export interface AuthState {
  showAuthPrompt: boolean;
  authenticated: boolean;
  userData: any;
}

const initialAuthState: AuthState = {
  showAuthPrompt: false,
  authenticated: false,
  userData: undefined
};

export const auth: Reducer<AuthState> = (state: AuthState = initialAuthState, action: Action) => {
  switch(action.type) {
    case AuthActions.SHOW_AUTH_PROMPT:
      return Object.assign({}, state, {showAuthPrompt: true});
    case AuthActions.AUTHENTICATED:
      return Object.assign({}, state, {
        showAuthPrompt: false,
        authenticated: true,
        userData: action.payload
      });
    default:
      return state
  }
};
