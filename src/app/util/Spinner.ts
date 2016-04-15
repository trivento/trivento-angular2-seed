import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component} from 'angular2/core';
import {Injectable} from 'angular2/core';

@Component({
  selector: 'spinner',
  template: `
    <div *ngIf="showSpinner" class="spinner-container">
      <svg class="spinner" width="56px" height="56px" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="28" cy="28" r="25"></circle>
      </svg>
    </div>
  `,
  styles: [require('./spinner.scss')]
})
export class Spinner {
  showSpinner: boolean;

  constructor(private store: Store<Boolean>) {
    store.select('spinner')
      .subscribe((s: Boolean) => this.showSpinner = s ? s.valueOf() : false);
  }
}

export class SpinnerAction {
  static START = 'spinner.start';
  static STOP = 'spinner.stop';
}

export const spinner: Reducer<Boolean> = (state: Boolean = false, action: Action) => {
  switch(action.type) {
    case SpinnerAction.START:
      return true;
    case SpinnerAction.STOP:
      return false;
    default:
      return state;
  }
};

@Injectable()
export class SpinnerService {
  constructor(private store: Store<Boolean>) {
  }

  start() {
    this.store.dispatch({type: SpinnerAction.START});
  }

  stop() {
    this.store.dispatch({type: SpinnerAction.STOP});
  }
}
