/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    deleteConnectionStringAction,
    setConnectionStringsAction,
    upsertConnectionStringAction
} from './actions';

describe('deleteConnectionStringAction', () => {
    it('returns CONNECTION_STRINGS/DELETE action object', () => {
        expect(deleteConnectionStringAction('connectionString')).toEqual({
            payload: 'connectionString',
            type: 'CONNECTION_STRINGS/DELETE'
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
        expect(upsertConnectionStringAction.started({ newConnectionString: 'new', connectionString: 'old'})).toEqual({
            payload: { newConnectionString: 'new', connectionString: 'old'},
            type: 'CONNECTION_STRINGS/UPSERT_STARTED'
        });
    });
});
