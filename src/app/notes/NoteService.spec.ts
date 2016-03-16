import { it, describe, expect, beforeEachProviders } from 'angular2/testing';
import {XHRBackend} from 'angular2/http';
import {NoteService} from './NoteService';
import {HTTP_PROVIDERS} from 'angular2/http';
import {provide} from 'angular2/core';
import {MockBackend} from 'angular2/src/http/backends/mock_backend';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {Response, ResponseOptions} from 'angular2/http';
import {Note} from './Note';
import {inject} from 'angular2/testing';
import {provideStore} from '@ngrx/store';
import {notesReducer, selectedNoteReducer} from './notesReducers';
import {Store, Action, Reducer} from '@ngrx/store';
import {NoteActionType} from './NoteActions';

//export class MockStore extends Store<any> {
//  dispatch(action: Action): void {
//    super.dispatch(action);
//    console.log('mockstore dispatch', action);
//  }
//}

describe('NoteService', () => {

  let receivedActions: Action[];

  let mockReducer: Reducer<any> = (state: any = [], action: Action) => {
    if (action.type.toString() !== '@@ngrx/INIT') {
      receivedActions.push(action);
    }
    return state;
  };

  beforeEachProviders(() => {
    return [
      HTTP_PROVIDERS,
      provide(XHRBackend, {useClass: MockBackend}),
      provideStore({mockReducer}),
      NoteService
    ];
  });

  beforeEach(() => {
    receivedActions = [];
  });

  it("should get all notes", inject([XHRBackend, NoteService], (mockBackend, noteService) => {
    const NOTES = [
      new Note('note 1', '', 1)
    ];

    mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: NOTES
      })));
    });

    noteService.getAll();

    expect(receivedActions).toEqual([{type: NoteActionType.GET_ALL, payload: NOTES}]);
  }));
});
