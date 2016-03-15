import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import {Component} from "angular2/core";
import {NotesState} from "./notesReducers";
import {ChangeDetectionStrategy} from "angular2/core";
import {NoteActions} from "./NoteActions";
import {NoteService} from "./NoteService";
import {Note} from "./Note";
import {Input} from "angular2/core";

@Component({
  selector: 'note-detail',
  template: `
    <div>
      <div>
        <h3 *ngIf="selectedNote.id">Editing {{originalTitle}}</h3>
        <h3 *ngIf="!selectedNote.id">Create New Note</h3>
      </div>
      <div>
        <form novalidate>
          <div>
            <label>Note Title</label>
            <input [(ngModel)]="selectedNote.title" type="text">
          </div>
          <div>
            <label>Note Text</label>
            <input [(ngModel)]="selectedNote.text" type="text">
          </div>
          <div>
            <button type="button" (click)="cancel()">Cancel</button>
            <button type="submit" (click)="save()">Save</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class NoteDetail {
  originalTitle: string;
  selectedNote: Note;

  // Every time the "item" input is changed, we copy it locally (and keep the original name to display)
  @Input('note') set note(value: Note) {
    if (value) {
      this.originalTitle = value.title;
    }
    this.selectedNote = Object.assign({}, value);
  }

  constructor(private noteService: NoteService, private store: Store<NotesState>) {
  }

  cancel() {
    this.store.dispatch(NoteActions.selectNote(new Note('', '')));
  }

  save() {
    this.noteService.saveNote(this.selectedNote);
    this.cancel();
  }
}
