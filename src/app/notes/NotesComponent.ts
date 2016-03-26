import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component} from 'angular2/core';
import {NotesState} from './notesReducers';
import {ChangeDetectionStrategy} from 'angular2/core';
import {NoteAction} from './NoteAction';
import {NoteService} from './NoteService';
import {Note} from './Note';
import {NotesList} from './NotesList';
import {NoteDetail} from './NoteDetail';

@Component({
  selector: 'notes',
  directives: [NotesList, NoteDetail],
  template: `
    <h2>Notes</h2>
    <notes-list [notes]="notes | async"
                (selected)="selectNote($event)"
                (deleted)="deleteNote($event)"></notes-list>
    <note-detail [note]="selectedNote | async"
                 (cancelled)="cancel($event)"
                 (saved)="save($event)"></note-detail>
  `
})
export class NotesComponent {
  notes: Observable<Array<Note>>;
  selectedNote: Observable<Note>;

  constructor(private noteService: NoteService, private store: Store<NotesState>) {
    this.notes = store.select('notesReducer');
    this.selectedNote = store.select('selectedNoteReducer');
    noteService.getAll();
  }

  selectNote(note: Note) {
    this.store.dispatch(NoteAction.selectNote(note));
  }

  deleteNote(note: Note) {
    this.noteService.deleteNote(note);
  }

  cancel() {
    this.store.dispatch(NoteAction.selectNote(new Note('', '')));
  }

  save(note: Note) {
    this.noteService.saveNote(note);
    this.cancel();
  }

}
