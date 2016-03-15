import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Note} from "./Note";
import {Store} from '@ngrx/store';
import {NotesState} from "./notesReducer";
import {NotesActionType} from "./notesReducer";
import {NotesActions} from "./NotesActions";
import {Http, Headers} from 'angular2/http';

const BASE_URL = 'http://localhost:3100/note/';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class NoteService {
  notes: Observable<Array<Note>>;

  constructor(private http: Http, private store: Store<NotesState>) {
    this.notes = store.select('notesReducer');
    this.notes.subscribe(nn => console.log('NoteService got notes', nn));
  }

  getAll() {
    this.http.get(BASE_URL)
      .map(res => res.json())
      .map(payload => NotesActions.getAll(payload))
      .subscribe(action => this.store.dispatch(action));
  }

  saveNote(note: Note) {
    (note.id) ? this.updateNote(note) : this.createNote(note);
  }

  updateNote(note: Note) {
    this.store.dispatch(NotesActions.updateNote(note));
  }

  createNote(note: Note) {
    let noteWithId: Note = Object.assign({}, note, {id: Math.random().toString().substring(2)});
    this.store.dispatch(NotesActions.createNote(noteWithId));
  }

  deleteNote(note: Note) {
    this.store.dispatch(NotesActions.deleteNote(note));
  }
}
