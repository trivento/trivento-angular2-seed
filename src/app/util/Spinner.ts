import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component} from 'angular2/core';
import {Injectable} from 'angular2/core';

@Component({
  selector: 'spinner',
  template: `
    <div *ngIf="showSpinner" class="spinner"><div>⧗</div></div>
  `,
  styles: [`
    .spinner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: right;
      font-size: 24px;
      color: red;
    }
  `]
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
