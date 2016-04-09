import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component} from 'angular2/core';
import {NotesState} from './notesReducers';
import {ChangeDetectionStrategy} from 'angular2/core';
import {NoteService} from './NoteService';
import {Note} from './Note';
import {Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'notes-list',
  template: `
    <md-content>
      <md-list>
        <h3 md-subheader>My Notes</h3>
        <md-list-item *ngFor="#note of notes">
          <h3 md-line>{{note.title}}</h3>
          <button md-icon-button color="primary" (click)="selected.emit(note)">
            <i class="material-icons md-24">edit</i>
          </button>
          <button md-icon-button color="warn" (click)="deleted.emit(note)">
            <i class="material-icons md-24">delete</i>
          </button>
        </md-list-item>
      </md-list>
    </md-content>
  `,
  styles: [require('./notes.scss')]
})
export class NotesList {
  @Input('notes') notes: Note[];
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
