import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NotesState} from './notesReducers';
import {NoteService} from './NoteService';
import {Note} from './Note';

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
            <button type="button" (click)="cancelled.emit()">Cancel</button>
            <button type="submit" (click)="saved.emit(selectedNote)">Save</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class NoteDetail {
  originalTitle: string;
  selectedNote: Note;

  // Every time the "item" input is changed, we copy it locally
  // (and keep the original name to display)
  @Input('note') set note(value: Note) {
    if (value) {
      this.originalTitle = value.title;
    }
    this.selectedNote = Object.assign({}, value);
  }

  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();

}
