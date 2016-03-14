import { Action, Reducer, Store } from '@ngrx/store';
import {NotesActionType} from "./notesReducer";
import {Note} from "./Note";

export class NotesActions {

  static getAll(notes: Note[]): Action {
    return {
      type: NotesActionType.GET_ALL,
      payload: notes
    };
  }

  static selectNote(note: Note): Action {
    return {
      type: NotesActionType.SELECT,
      payload: note
    };
  }

  static deleteNote(note: Note): Action {
    return {
      type: NotesActionType.DELETE,
      payload: note
    };
  }

  static createNote(note: Note): Action {
    return {
      type: NotesActionType.CREATE,
      payload: note
    };
  }

  static updateNote(note: Note): Action {
    return {
      type: NotesActionType.UPDATE,
      payload: note
    };
  }
}
