import {Reducer, Action} from '@ngrx/store';
import {Note} from "./Note";
import * as _ from 'lodash';

export enum NotesActionType {
  GET, GET_ALL, CREATE, UPDATE, DELETE, SELECT
}

export interface NotesState {
  notes: Note[];
  selectedNote: Note;
}

export const notesReducer: Reducer<any> = (state: any = [], action: Action) => {
  console.log('notesReducer ' + NotesActionType[action.type] + ' = ' + action.type);
  console.log('notesReducer', action.payload);
  switch (action.type) {
    case NotesActionType.GET_ALL:
      return action.payload;
    case NotesActionType.CREATE:
      return [...state, action.payload];
    case NotesActionType.UPDATE:
      return state.map(note => {
        return note.id === action.payload.id ? Object.assign({}, note, action.payload) : note;
      });
    case NotesActionType.DELETE:
      return state.filter(note => {
        return note.id !== action.payload.id;
      });
    default:
      return state;
  }
};
