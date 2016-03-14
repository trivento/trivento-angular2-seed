import {Reducer, Action} from '@ngrx/store';
import {Note} from "./Note";
import {NotesActionType} from "./notesReducer";

export const selectedNoteReducer: Reducer<Note> = (state: Note = null, action: Action) => {
  switch (action.type) {
    case NotesActionType.SELECT:
      return action.payload;
    default:
      return state;
  }
};
