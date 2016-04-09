import {Store} from '@ngrx/store';
import {Component} from 'angular2/core';
import {Toast2} from './toast2';

@Component({
  selector: 'toast2',
  template: `
    <div id="toast2-container" class="toast2-bottom-right">
      <div *ngFor="#toast of toasts" class="toast2" [ngClass]="'toast2-' + toast.type">
        {{toast.message}}
      </div>
    </div>
  `,
  styles: [require('./toast2.scss')]
})
export class Toast2Component {
  toasts: Toast2[];

  constructor(private store: Store<Array<Toast2>>) {
    store.select('toast2').subscribe((toasts: Toast2[]) => {
      this.toasts = toasts;
    });
  }

}
