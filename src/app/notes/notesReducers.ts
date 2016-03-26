import {Reducer, Action} from '@ngrx/store';
import {Note} from './Note';
import * as _ from 'lodash';
import {NoteAction} from './NoteAction';

export interface NotesState {
  notes: Note[];
  selectedNote: Note;
}

export const notesReducer: Reducer<any> = (state: any = [], action: Action) => {
  switch (action.type) {
    case NoteAction.GET_ALL:
      return action.payload;
    case NoteAction.CREATE:
      return [...state, action.payload];
    case NoteAction.UPDATE:
      return state.map(note => {
        return note.id === action.payload.id ? _.cloneDeep(action.payload) : note;
      });
    case NoteAction.DELETE:
      return state.filter(note => {
        return note.id !== action.payload.id;
      });
    default:
      return state;
  }
};

export const selectedNoteReducer: Reducer<Note> = (state: Note = null, action: Action) => {
  switch (action.type) {
    case NoteAction.SELECT:
      return action.payload;
    default:
      return state;
  }
};
