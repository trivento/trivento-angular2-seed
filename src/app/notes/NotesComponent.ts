import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import {Component} from "angular2/core";
import {NotesState} from "./notesReducer";
import {NotesActionType} from "./notesReducer";
import {ChangeDetectionStrategy} from "angular2/core";
import {NotesActions} from "./NotesActions";
import {NoteService} from "./NoteService";
import {Note} from "./Note";
import {NotesList} from "./NotesList";
import {NoteDetail} from "./NoteDetail";

@Component({
  selector: 'notes',
  directives: [NotesList, NoteDetail],
  template: `
    <h3>NOTES</h3>
    <notes-list [notes]="notes | async"></notes-list>
    <note-detail [note]="selectedNote | async"></note-detail>
    <h3>NOTES END</h3>
  `
})
export class NotesComponent {
  notes: Observable<Array<Note>>;
  selectedNote: Observable<Note>;

  constructor(private noteService: NoteService, private store: Store<NotesState>) {
    this.notes = noteService.notes;
    this.notes.subscribe(nn => console.log('NotesComponent got notes', nn));
    this.selectedNote = store.select('selectedNoteReducer');
    this.selectedNote.subscribe(note => console.log('selected note', note));
    noteService.getAll();
  }

}
