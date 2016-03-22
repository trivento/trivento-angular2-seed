import {Reducer, Action} from '@ngrx/store';

export class Toast2Type {
  static ERROR: string = 'error';
  static WARNING: string = 'warning';
  static INFO: string = 'info';
  static SUCCESS: string = 'success';
  static REMOVE: string = 'remove';
}

export class Toast2 {
  constructor(public message: string, public type: string, public id: number) {}
}

export const toast2: Reducer<any> = (state: any = [], action: Action) => {
  switch(action.type) {
    case Toast2Type.ERROR:
      return [...state, new Toast2(action.payload.message, Toast2Type.ERROR, action.payload.id)];
    case Toast2Type.REMOVE:
      return state.filter(toast => {
        return toast.id !== action.payload.id;
      });
    default:
      return state;
  }
};
