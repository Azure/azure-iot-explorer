/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringsStateInterface, connectionStringsStateInitial } from './state';
import { getConnectionStringsAction, deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction } from './actions';
import { connectionStringsReducer } from './reducer';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';
import { SET, UPSERT, DELETE, GET } from '../constants/actionTypes';

const stringWithExpiry = {
    connectionString: 'connectionString1',
    expiration: (new Date()).toUTCString()
};
describe('getConnectionStringsAction', () => {
    it (`handles ${GET}/ACTION_START action`, () => {
        const action = getConnectionStringsAction.started();

        expect(connectionStringsReducer(connectionStringsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    it (`handles ${GET}/ACTION_DONE action`, () => {
        const action =  getConnectionStringsAction.done({ result: [stringWithExpiry] });
        expect(connectionStringsReducer(connectionStringsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.fetched);
        expect(connectionStringsReducer(connectionStringsStateInitial(), action).payload).toEqual([stringWithExpiry]);
    });
});

describe('deleteConnectionStringAction', () => {
    const initialState = connectionStringsStateInitial().merge({
        payload: [stringWithExpiry]
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
        payload: [{
            connectionString: 'connectionString1',
            expiration: (new Date()).toUTCString()
        },
        {
            connectionString: 'connectionString2',
            expiration: (new Date()).toUTCString()
        }]
    });

    const newStringWithExpiry = {
        connectionString: 'connectionString3',
        expiration: (new Date()).toUTCString()
    };

    it (`handles ${SET}/ACTION_START action`, () => {
        const action = setConnectionStringsAction.started([newStringWithExpiry]);
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${SET}/ACTION_DONE action`, () => {
        const action =  setConnectionStringsAction.done({ params: [newStringWithExpiry], result: [newStringWithExpiry] });
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });
});

describe('upsertConnectionStringAction', () => {
    const initialPayload = [{
        connectionString: 'connectionString1',
        expiration: (new Date()).toUTCString()
    },
    {
        connectionString: 'connectionString2',
        expiration: (new Date()).toUTCString()
    }];
    const initialState = connectionStringsStateInitial().merge({
        payload: initialPayload
    });

    const newStringWithExpiry = {
        connectionString: 'connectionString3',
        expiration: (new Date()).toUTCString()
    };

    it (`handles ${UPSERT}/ACTION_START action`, () => {
        const action = upsertConnectionStringAction.started(newStringWithExpiry);
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${UPSERT}/ACTION_DONE action`, () => {
        const action =  upsertConnectionStringAction.done({ params: newStringWithExpiry, result: [
            newStringWithExpiry,
            ...initialPayload]
        });
        expect(connectionStringsReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });
});
