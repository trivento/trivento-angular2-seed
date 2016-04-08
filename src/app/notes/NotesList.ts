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
    <ul>
      <li *ngFor="#note of notes" (click)="selected.emit(note)">
        {{note.title}}
        <button (click)="deleted.emit(note)">X</button>
      </li>
    </ul>
  `,
  styles: [require('../main.scss')]
})
export class NotesList {
  @Input('notes') notes: Note[];
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
