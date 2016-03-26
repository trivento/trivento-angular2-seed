import { it, describe, expect } from 'angular2/testing';
import {Note} from './Note';
import {notesReducer, selectedNoteReducer} from './notesReducers';
import {NoteAction} from './NoteAction';
import * as _ from 'lodash';

describe('Notes', () => {

  describe('selectedNote store', () => {
    const NOTE = new Note('note a', '', 1);
    it('returns null by default', () => {
      let defaultState = selectedNoteReducer(undefined, {type: 'random'});

      expect(defaultState).toBeNull();
    });
    it('SELECT returns the provided payload', () => {
      let newNote = selectedNoteReducer(undefined, NoteAction.selectNote(_.cloneDeep(NOTE)));

      expect(newNote).toEqual(NOTE);
    });
  });

  describe('notes store', () => {
    const INITIAL_NOTES = [
      new Note('note 1', '', 1),
      new Note('note 2', '', 2)
    ];
    let initialState: Note[];

    beforeEach(() => {
      initialState = _.cloneDeep(INITIAL_NOTES);
    });

    it('returns an empty notes list by default', () => {
      let defaultState = notesReducer(undefined, {type: 'random'});

      expect(defaultState).toEqual([]);
    });
    it('GET_ALL', () => {
      let newNotes = notesReducer([], NoteAction.getAll(initialState));

      expect(newNotes).toEqual(INITIAL_NOTES);
    });
    it('CREATE', () => {
      let newNote = new Note('note 3', '', 3);

      let newNotes = notesReducer(initialState, NoteAction.createNote(newNote));

      expect(newNotes).toEqual([...INITIAL_NOTES, newNote]);
    });
    it('UPDATE', () => {
      let changedNote = new Note('note 2a', '', 2);

      let newNotes = notesReducer(initialState, NoteAction.updateNote(_.cloneDeep(changedNote)));

      expect(newNotes).toEqual([INITIAL_NOTES[0], changedNote]);
    });
    it('DELETE', () => {
      let deletedNote = new Note('note 1', '', 1);

      let newNotes = notesReducer(initialState, NoteAction.deleteNote(deletedNote));

      expect(newNotes).toEqual([INITIAL_NOTES[1]]);
    });
  });
});
