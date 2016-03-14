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
    <h3>NOTES LIST</h3>
    <ul>
      <li *ngFor="#note of notes" (click)="selectNote(note)">{{note.title}} <span (click)="deleteNote(note)">X</span></li>
    </ul>
    <h3>NOTES LIST END</h3>
  `
})
export class NotesList {
  //@Input('notes') notes: Note[];
  private _notes: Note[];
  @Input('notes') set notes(value: Note[]) {
    console.log('NotesList got notes', value);
    this._notes = value;
  }
  get notes() {
    return this._notes;
  }

  constructor(private noteService: NoteService, private store: Store<NotesState>) {
  }

  selectNote(note: Note) {
    this.store.dispatch(NotesActions.selectNote(note));
  }

  deleteNote(note: Note) {
    this.store.dispatch(NotesActions.deleteNote(note));
  }
}
