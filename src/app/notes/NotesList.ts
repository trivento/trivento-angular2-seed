import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import {Component} from "angular2/core";
import {NotesState} from "./notesReducer";
import {NotesActionType} from "./notesReducer";
import {ChangeDetectionStrategy} from "angular2/core";
import {NotesActions} from "./NotesActions";
import {NoteService} from "./NoteService";
import {Note} from "./Note";
import {Input} from "angular2/core";

@Component({
  selector: 'notes-list',
  template: `
    <ul>
      <li *ngFor="#note of notes" (click)="selectNote(note)">
        {{note.title}}
        <button (click)="deleteNote(note)">X</button>
      </li>
    </ul>
  `,
  styles: [`
    li { cursor: pointer; }
    li:hover { background-color: #ccc; }
  `]
})
export class NotesList {
  @Input('notes') notes: Note[];

  constructor(private noteService: NoteService, private store: Store<NotesState>) {
  }

  selectNote(note: Note) {
    this.store.dispatch(NotesActions.selectNote(note));
  }

  deleteNote(note: Note) {
    this.noteService.deleteNote(note);
  }
}
