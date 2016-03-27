import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl, Control} from 'angular2/common';
import {StringMapWrapper} from 'angular2/src/facade/collection';
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
        <form novalidate [ngFormModel]="noteForm">
          <div>
            <label>Note Title</label>
            <input type="text" [(ngModel)]="selectedNote.title" ngControl="title">
          </div>
          <div *ngIf="!titleField.valid && titleField.touched" class="validation-errors">
            <div *ngIf="titleField.hasError('required')">Please enter a title</div>
            <div *ngIf="titleField.hasError('minlength')">Title min. length is 5</div>
            <div *ngIf="titleField.hasError('noteTitle')">Title must start with 'Note'</div>
          </div>
          <div>
            <label>Note Text</label>
            <input type="text" [(ngModel)]="selectedNote.text" ngControl="text">
          </div>
          <div>
            <button type="button" (click)="cancelled.emit()">Cancel</button>
            <button type="submit" (click)="saved.emit(selectedNote)">Save</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .validation-errors {
      font-size: small;
      color: red;
      font-weight: bold;
      padding-bottom: 4px;
    }
  `]
})
export class NoteDetail {
  originalTitle: string;
  selectedNote: Note;
  noteForm: ControlGroup;
  titleField: AbstractControl;

  // Every time the "item" input is changed, we copy it locally
  // (and keep the original name to display)
  @Input('note') set note(value: Note) {
    if (value) {
      this.originalTitle = value.title;
      this.resetNoteForm();
    }
    this.selectedNote = Object.assign({}, value);
  }

  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.noteForm = this.formBuilder.group({
      title: ['',
        Validators.compose([Validators.required, Validators.minLength(5), this.checkNoteTitle])],
      text: ['']
    });
    this.titleField = this.noteForm.controls['title'];
  }

  // Workaround for https://github.com/angular/angular/issues/4933
  resetNoteForm() {
    this.noteForm['_touched'] = false;
    StringMapWrapper.forEach(this.noteForm.controls, (control: AbstractControl, name: string) => {
      control['_touched'] = false;
    });
  }

  checkNoteTitle(fieldControl: Control) {
    return (!fieldControl.value || fieldControl.value.startsWith('Note'))
      ? null : {noteTitle: true};
  }

}
