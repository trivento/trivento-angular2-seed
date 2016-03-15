import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Note} from "./Note";
import {Store} from '@ngrx/store';
import {NotesState} from "./notesReducers";
import {NoteActions} from "./NoteActions";
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

  //TODO error handling
  getAll() {
    this.http.get(BASE_URL)
      .map(res => res.json())
      .map(payload => NoteActions.getAll(payload))
      .subscribe(action => this.store.dispatch(action), (x) => console.log('ERROR', x));
  }

  saveNote(note: Note) {
    (note.id) ? this.updateNote(note) : this.createNote(note);
  }

  updateNote(note: Note) {
    this.store.dispatch(NoteActions.updateNote(note));
    this.http.put(BASE_URL + note.id, JSON.stringify(note), HEADER)
      .map(res => res.json())
      .subscribe(payload => this.store.dispatch(NoteActions.updateNote(payload)));
  }

  createNote(note: Note) {
    let noteWithId: Note = Object.assign({}, note, {id: Math.ceil(Math.random() * 1000000)});
    this.http.post(BASE_URL, JSON.stringify(noteWithId), HEADER)
      .map(res => res.json())
      .subscribe(payload => this.store.dispatch(NoteActions.createNote(payload)));
  }

  deleteNote(note: Note) {
    this.http.delete(BASE_URL + note.id)
      .subscribe(() => this.store.dispatch(NoteActions.deleteNote(note)));
  }
}
