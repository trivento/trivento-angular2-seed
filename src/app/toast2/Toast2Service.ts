import {Injectable} from 'angular2/core';
import {Store} from '@ngrx/store';
import {Toast2} from './toast2';
import {Toast2Type} from './toast2';

@Injectable()
export class Toast2Service {

  constructor(private store: Store<Array<Toast2>>) {
  }

  display(message: string, type: string, timeout: number = 5000) {
    let id = Math.ceil(Math.random() * 1000000000);
    this.store.dispatch({type: type, payload: {id: id, message: message}});
    setTimeout(() => {
      this.store.dispatch({type: Toast2Type.REMOVE, payload: {id: id}});
    }, timeout);
  }
}
