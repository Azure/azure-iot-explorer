/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringsStateInterface } from './state';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction } from './actions';
import { connectionStringsReducer } from './reducer';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';
import { SET, UPSERT } from '../constants/actionTypes';

describe('deleteConnectionStringAction', () => {
    it('removes connection string from list', () => {
        const initialState: ConnectionStringsStateInterface = {
            payload: [
            'connectionString1'
            ],
            synchronizationStatus: SynchronizationStatus.initialized
        };

        const action = deleteConnectionStringAction('connectionString1');
        const result = connectionStringsReducer(initialState, action);
        expect(result.payload).toHaveLength(0);
    });
});

describe('setConnectionStringAction', () => {
    const initialState: ConnectionStringsStateInterface = {
        payload: [
        'connectionString1',
        'connectionString2'
        ],
        synchronizationStatus: SynchronizationStatus.initialized
    };

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

    const initialState: ConnectionStringsStateInterface = {
        payload: [
        'connectionString1',
        'connectionString2'
        ],
        synchronizationStatus: SynchronizationStatus.initialized
    };

    it (`handles ${UPSERT}/ACTION_START action`, () => {
        const action = upsertConnectionStringAction.started({newConnectionString: 'connectionString3'});
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${UPSERT}/ACTION_DONE action`, () => {
        const action =  upsertConnectionStringAction.done({ params: {newConnectionString: 'connectionString3'}, result: ['connectionString1', 'connectionString2', 'connectionString3'] });
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });
});
