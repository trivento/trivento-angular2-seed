import {Reducer, Action} from '@ngrx/store';
import {Note} from "./Note";
import * as _ from 'lodash';
import {NoteActionType} from './NoteActions';

export interface NotesState {
  notes: Note[];
  selectedNote: Note;
}

export const notesReducer: Reducer<any> = (state: any = [], action: Action) => {
  switch (action.type) {
    case NoteActionType.GET_ALL:
      return action.payload;
    case NoteActionType.CREATE:
      return [...state, action.payload];
    case NoteActionType.UPDATE:
      return state.map(note => {
        return note.id === action.payload.id ? Object.assign({}, note, action.payload) : note;
      });
    case NoteActionType.DELETE:
      return state.filter(note => {
        return note.id !== action.payload.id;
      });
    default:
      return state;
  }
};

export const selectedNoteReducer: Reducer<Note> = (state: Note = null, action: Action) => {
  switch (action.type) {
    case NoteActionType.SELECT:
      return action.payload;
    default:
      return state;
  }
};
