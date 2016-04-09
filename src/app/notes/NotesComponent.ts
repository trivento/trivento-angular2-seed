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
    <div class="notes-component">
    <notes-list [notes]="notes | async"
                (selected)="selectNote($event)"
                (deleted)="deleteNote($event)"></notes-list>
    <note-detail [note]="selectedNote | async"
                 (cancelled)="cancel($event)"
                 (saved)="save($event)"></note-detail>
    </div>
  `,
  styles: [`
    .notes-component {
      display: -webkit-flex; /* Safari */
      display: flex;
      -webkit-flex-direction: row; /* Safari */
      flex-direction:         row;
      -webkit-justify-content: center; /* Safari */
      justify-content:         center;
      -webkit-align-items: flex-start; /* Safari */
      align-items:         flex-start;
    }
    notes-list, note-detail {
      width: 50%;
    }
  `]
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
