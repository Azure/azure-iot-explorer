/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringsStateInterface } from './state';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction } from './actions';
import { connectionStringsReducer } from './reducer';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';
import { SET } from '../constants/actionTypes';

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
    it('overwrites existing connection string', () => {
        const initialState: ConnectionStringsStateInterface = {
            payload: [
            'connectionString1',
            'connectionString2'
            ],
            synchronizationStatus: SynchronizationStatus.initialized
        };

        const action =  upsertConnectionStringAction({ newConnectionString: 'newConnectionString2', connectionString: 'connectionString2'});
        const result = connectionStringsReducer(initialState, action);
        expect(result.payload).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(result.payload).toEqual(['connectionString1', 'newConnectionString2']);
    });

    it('appends neww connection string', () => {
        const initialState: ConnectionStringsStateInterface = {
            payload: [
            'connectionString1',
            'connectionString2'
            ],
            synchronizationStatus: SynchronizationStatus.initialized
        };
        const action =  upsertConnectionStringAction({ newConnectionString: 'connectionString3' });
        const result = connectionStringsReducer(initialState, action);
        expect(result.payload).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(result.payload).toEqual(['connectionString1', 'connectionString2', 'connectionString3']);

    });
});
