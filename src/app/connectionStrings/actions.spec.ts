/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    addConnectionStringAction,
    deleteConnectionStringAction
} from './actions';

describe('addConnectionStringAction', () => {
    it('returns CONNECTION_STRINGS/ADD action object', () => {
        expect(addConnectionStringAction('connectionString')).toEqual({
            payload: 'connectionString',
            type: 'CONNECTION_STRINGS/ADD'
        });
    });
});

describe('deleteConnectionStringAction', () => {
    it('returns CONNECTION_STRINGS/DELETE action object', () => {
        expect(deleteConnectionStringAction('connectionString')).toEqual({
            payload: 'connectionString',
            type: 'CONNECTION_STRINGS/DELETE'
        });
    });
});
