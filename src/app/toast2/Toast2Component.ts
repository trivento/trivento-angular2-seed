import {Store} from '@ngrx/store';
import {Component} from 'angular2/core';
import {Toast2} from './toast2';

@Component({
  selector: 'toast2',
  template: `
    <div class="toast2-container">
      <ul class="toast2-list">
        <li *ngFor="#toast of toasts" class="toast2-item" [ngClass]="toast.type">
          {{toast.message}}
        </li>
      </ul>
    </div>
  `
})
export class Toast2Component {
  toasts: Toast2[];

  constructor(private store: Store<Array<Toast2>>) {
    store.select('toast2').subscribe((toasts: Toast2[]) => {
      this.toasts = toasts;
    });
  }

}
