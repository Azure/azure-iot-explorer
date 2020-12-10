/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    getConnectionStringsAction,
    deleteConnectionStringAction,
    setConnectionStringsAction,
    upsertConnectionStringAction
} from './actions';

describe('getConnectionStringsAction', () => {
    it('returns CONNECTION_STRINGS/DELETE action object', () => {
        expect(getConnectionStringsAction.started()).toEqual({
            payload: undefined,
            type: 'CONNECTION_STRINGS/GET_STARTED'
        });
    });
});

describe('deleteConnectionStringAction', () => {
    it('returns CONNECTION_STRINGS/DELETE action object', () => {
        expect(deleteConnectionStringAction.started('connectionString')).toEqual({
            payload: 'connectionString',
            type: 'CONNECTION_STRINGS/DELETE_STARTED'
        });
    });
});

describe('setConnectionStringAction', () => {
    it('returns CONNECTION_STRINGS/SET action object', () => {
        expect(setConnectionStringsAction.started([])).toEqual({
            payload: [],
            type: 'CONNECTION_STRINGS/SET_STARTED'
        });
    });
});

describe('upsertConnectionStringAction', () => {
    it('returns CONNECTION_STRINGS/UPSERT action object', () => {
        const stringWithExpiry = {
            connectionString: 'connectionString1',
            expiration: (new Date(0)).toUTCString()
        };
        expect(upsertConnectionStringAction.started(stringWithExpiry)).toEqual({
            payload: stringWithExpiry,
            type: 'CONNECTION_STRINGS/UPSERT_STARTED'
        });
    });
});
