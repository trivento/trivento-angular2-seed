import { Injectable } from 'angular2/core';
import { Action, Reducer, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
import { normalize, arrayOf, Schema } from 'normalizr';
import { List, Map, Record, fromJS } from 'immutable';
import { ApiService } from '../services/api';

export const LOADING_USERS = 1;
export const LOADED_USERS = 2;
export const LOADING_USER = 3;
export const LOADED_USER = 4;
export const ADDING_USER = 5;
export const ADDED_USER = 6;
export const DELETING_USER = 7;
export const DELETED_USER = 8;
export const PATCHED_USER = 9;

const PATCH_USER = 10;
const DELETE_USER = 11;
const ADD_USER = 12;
const LOAD_USER = 13;
const LOAD_USERS = 14;

export const userSchema = new Schema('users');
export const UserRecord = Record({
  id: null,
  name: null,
  email: null,
  deleting: false
});

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IUsers extends Map<String, any> {
  result: List<Number>;
  entities: {users: Map<Number, IUser>};
  adding: boolean;
  loading: boolean;
}

@Injectable()
export class Users {
  loading$: Observable<Map<String, Boolean>>;
  adding$: Observable<Map<String, Boolean>>;
  users$: Observable<Map<String, any>>;

  private actions$ = new BehaviorSubject<Action>({type: null, payload: null});

  constructor(private _store: Store<any>, api: ApiService) {
    const store$ = this._store.select<IUsers>('users');

    this.adding$ = store$.map(data => data.get('adding'));
	  this.loading$ = store$.map(data => data.get('loading'));

	  this.users$ = store$.map(data => {
	    return data.get('result').reduce((acc, userId) => {
	      acc.push(data.getIn(['entities', 'users', userId]));
	      return acc;
	    }, []);
	  });

    let adds = this.actions$
      .filter(action => action.type === ADD_USER)
      .do(() => _store.dispatch({type: ADDING_USER}))
      .mergeMap(
        action => api.createUser(action.payload),
        (action, payload: IUser) => ({type: ADDED_USER, payload}));

    let deletes = this.actions$
      .filter(action => action.type === DELETE_USER && !action.payload.deleting)
      .do(action => _store.dispatch({type: DELETING_USER, payload: action.payload}))
      .mergeMap(action => api.deleteUser(action.payload.id),
        (action, payload: IUser) => ({type: DELETED_USER, payload: action.payload.id}));

    let loads = this.actions$
      .filter(action => action.type === LOAD_USERS)
      .do(() => _store.dispatch({type: LOADING_USERS}))
      .mergeMap(action => api.loadUsers(),
        (action, payload: IUser[]) => ({type: LOADED_USERS, payload}));

    let loadsOne = this.actions$
      .filter(action => action.type === LOAD_USER)
      .do(() => _store.dispatch({type: LOADING_USER}))
      .mergeMap(action => api.loadUser(action.payload),
        (action, payload: IUser) => ({type: LOADED_USER, payload: payload}));

    let patchesOne = this.actions$
      .filter(action => action.type === PATCH_USER)
      .mergeMap(action => api.updateUser(action.payload),
        (action, payload: IUser) => ({type: PATCHED_USER, payload}));

    Observable
      .merge(adds, deletes, loads, loadsOne, patchesOne)
      .subscribe((action: Action) => _store.dispatch(action));
  }

  addUser(user) {
    this.actions$.next({type: ADD_USER, payload: user});
  }

  deleteUser(user) {
    this.actions$.next({type: DELETE_USER, payload: user});
  }

  loadUsers() {
    this.actions$.next({type: LOAD_USERS});
  }

  loadUser(id) {
    id = parseInt(id, 10);
    this.actions$.next({type: LOAD_USER, payload: id});
    return this.users$
      .map(data => data.find(item => item.id === id) || {});
  }

  patchUser(user) {
    this.actions$.next({type: PATCH_USER, payload: user});
  }

  reloadUsers() {
    this._store.dispatch({type: LOADED_USERS, payload: []});
    this.loadUsers();
  }
}
