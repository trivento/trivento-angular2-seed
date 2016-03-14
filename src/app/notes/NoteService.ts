import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Note} from "./Note";
import {Store} from '@ngrx/store';
import {NotesState} from "./notesReducer";
import {NotesActionType} from "./notesReducer";
import {NotesActions} from "./NotesActions";

@Injectable()
export class NoteService {
  notes: Observable<Array<Note>>;

  constructor(private store: Store<NotesState>) {
    this.notes = store.select('notesReducer');
    this.notes.subscribe(nn => console.log('NoteService got notes', nn));
  }
// = Math.random().toString().substring(2)
  getAll() {
    let initialNotes: Note[] = [
      new Note('note 1', 'oudciudiurvewv', '1'),
      new Note('note 2', 'akjnsdcjknsdckjn', '2')
    ];
    this.store.dispatch(NotesActions.getAll(initialNotes));
  }
}
