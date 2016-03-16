import { Action, Reducer, Store } from '@ngrx/store';
import {Note} from './Note';

export class NoteActionType {
  static GET_ALL = 'GET_ALL';
  static CREATE = 'CREATE';
  static UPDATE = 'UPDATE';
  static DELETE = 'DELETE';
  static SELECT = 'SELECT';
}

export class NoteActions {

  static getAll(notes: Note[]): Action {
    return {
      type: NoteActionType.GET_ALL,
      payload: notes
    };
  }

  static selectNote(note: Note): Action {
    return {
      type: NoteActionType.SELECT,
      payload: note
    };
  }

  static deleteNote(note: Note): Action {
    return {
      type: NoteActionType.DELETE,
      payload: note
    };
  }

  static createNote(note: Note): Action {
    return {
      type: NoteActionType.CREATE,
      payload: note
    };
  }

  static updateNote(note: Note): Action {
    return {
      type: NoteActionType.UPDATE,
      payload: note
    };
  }
}
