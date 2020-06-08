/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringsStateInterface } from './state';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction } from './actions';
import { connectionStringsReducer } from './reducer';

describe('deleteConnectionStringAction', () => {
    it('removes connection string from list', () => {
        const initialState: ConnectionStringsStateInterface = {
            connectionStrings: [
            'connectionString1'
            ]
        };

        const action = deleteConnectionStringAction('connectionString1');
        const result = connectionStringsReducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(0);
    });
});

describe('setConnectionStringAction', () => {
    it('sets', () => {
        const initialState: ConnectionStringsStateInterface = {
            connectionStrings: [
            'connectionString1',
            'connectionString2'
            ]
        };

        const action =  setConnectionStringsAction(['connectionString3']);
        const result = connectionStringsReducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(1);
        expect(result.connectionStrings).toEqual(['connectionString3']);
    });
});

describe('upsertConnectionStringAction', () => {
    it('overwrites existing connection string', () => {
        const initialState: ConnectionStringsStateInterface = {
            connectionStrings: [
            'connectionString1',
            'connectionString2'
            ]
        };

        const action =  upsertConnectionStringAction({ newConnectionString: 'newConnectionString2', connectionString: 'connectionString2'});
        const result = connectionStringsReducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(result.connectionStrings).toEqual(['connectionString1', 'newConnectionString2']);
    });

    it('appends neww connection string', () => {
        const initialState: ConnectionStringsStateInterface = {
            connectionStrings: [
            'connectionString1',
            'connectionString2'
            ]
        };
        const action =  upsertConnectionStringAction({ newConnectionString: 'connectionString3' });
        const result = connectionStringsReducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(result.connectionStrings).toEqual(['connectionString1', 'connectionString2', 'connectionString3']);

    });
});
