import { Action, Reducer, Store } from '@ngrx/store';
import {Note} from './Note';

export class NoteAction {
  static GET_ALL = 'GET_ALL';
  static CREATE = 'CREATE';
  static UPDATE = 'UPDATE';
  static DELETE = 'DELETE';
  static SELECT = 'SELECT';

  static getAll(notes: Note[]): Action {
    return {
      type: NoteAction.GET_ALL,
      payload: notes
    };
  }

  static selectNote(note: Note): Action {
    return {
      type: NoteAction.SELECT,
      payload: note
    };
  }

  static deleteNote(note: Note): Action {
    return {
      type: NoteAction.DELETE,
      payload: note
    };
  }

  static createNote(note: Note): Action {
    return {
      type: NoteAction.CREATE,
      payload: note
    };
  }

  static updateNote(note: Note): Action {
    return {
      type: NoteAction.UPDATE,
      payload: note
    };
  }
}
