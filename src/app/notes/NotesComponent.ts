import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component} from 'angular2/core';
import {NotesState} from './notesReducers';
import {ChangeDetectionStrategy} from 'angular2/core';
import {NoteActions} from './NoteActions';
import {NoteService} from './NoteService';
import {Note} from './Note';
import {NotesList} from './NotesList';
import {NoteDetail} from './NoteDetail';

@Component({
  selector: 'notes',
  directives: [NotesList, NoteDetail],
  template: `
    <h2>Notes</h2>
    <notes-list [notes]="notes | async"></notes-list>
    <note-detail [note]="selectedNote | async"></note-detail>
  `
})
export class NotesComponent {
  notes: Observable<Array<Note>>;
  selectedNote: Observable<Note>;

  constructor(private noteService: NoteService, private store: Store<NotesState>) {
    this.notes = noteService.notes;
    this.selectedNote = store.select('selectedNoteReducer');
    noteService.getAll();
  }

}
