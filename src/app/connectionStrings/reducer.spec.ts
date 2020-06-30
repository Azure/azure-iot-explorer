/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringsStateInterface, connectionStringsStateInitial } from './state';
import { getConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction } from './actions';
import { connectionStringsReducer } from './reducer';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';
import { SET, UPSERT, DELETE, GET } from '../constants/actionTypes';

describe('getConnectionStringAction', () => {
    it (`handles ${GET}/ACTION_START action`, () => {
        const action = getConnectionStringAction.started();

        expect(connectionStringsReducer(connectionStringsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    it (`handles ${GET}/ACTION_DONE action`, () => {
        const action =  getConnectionStringAction.done({ result: ['connectionString1'] });
        expect(connectionStringsReducer(connectionStringsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.fetched);
        expect(connectionStringsReducer(connectionStringsStateInitial(), action).payload).toEqual(['connectionString1']);
    });
});

describe('deleteConnectionStringAction', () => {
    const initialState = connectionStringsStateInitial().merge({
        payload: ['connectionString1']
    });

    it (`handles ${DELETE}/ACTION_START action`, () => {
        const action = deleteConnectionStringAction.started('connectionString1');
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${DELETE}/ACTION_DONE action`, () => {
        const action =  deleteConnectionStringAction.done({ params: 'connectionString1', result: [] });
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.deleted);
        expect(connectionStringsReducer(initialState, action).payload).toEqual([]);
    });
});

describe('setConnectionStringsAction', () => {
    const initialState = connectionStringsStateInitial().merge({
        payload: ['connectionString1', 'connectionString2']
    });

    it (`handles ${SET}/ACTION_START action`, () => {
        const action = setConnectionStringsAction.started(['connectionString3']);
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${SET}/ACTION_DONE action`, () => {
        const action =  setConnectionStringsAction.done({ params: ['connectionString3'], result: ['connectionString3'] });
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });
});

describe('upsertConnectionStringAction', () => {
    const initialState = connectionStringsStateInitial().merge({
        payload: ['connectionString1', 'connectionString2']
    });

    it (`handles ${UPSERT}/ACTION_START action`, () => {
        const action = upsertConnectionStringAction.started({newConnectionString: 'connectionString3'});
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${UPSERT}/ACTION_DONE action`, () => {
        const action =  upsertConnectionStringAction.done({ params: {newConnectionString: 'connectionString3'}, result: ['connectionString1', 'connectionString2', 'connectionString3'] });
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });
});
