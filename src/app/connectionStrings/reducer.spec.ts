/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringsStateInterface } from './state';
import { addConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction } from './actions';
import reducer from './reducer';

describe('addConnectionStringAction', () => {
    it('amends existing list of connection strings', () => {
        const initialState: ConnectionStringsStateInterface = {
            connectionStrings: [
                'connectionString1'
            ]
        };

        const action =  addConnectionStringAction('connectionString2');
        const result = reducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(result.connectionStrings[1]).toEqual('connectionString2');
    });

    it('does not duplicate connection strings', () => {
        const initialState: ConnectionStringsStateInterface = {
            connectionStrings: [
            'connectionString1'
            ]
        };

        const action =  addConnectionStringAction('connectionString1');
        const result = reducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(1); // tslint:disable-line:no-magic-numbers
        expect(result.connectionStrings[0]).toEqual('connectionString1');
    });
});

describe('deleteConnectionStringAction', () => {
    it('removes connection string from list', () => {
        const initialState: ConnectionStringsStateInterface = {
            connectionStrings: [
            'connectionString1'
            ]
        };

        const action =  deleteConnectionStringAction('connectionString1');
        const result = reducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(0); // tslint:disable-line:no-magic-numbers
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
        const result = reducer(initialState, action);
        expect(result.connectionStrings).toHaveLength(1); // tslint:disable-line:no-magic-numbers
        expect(result.connectionStrings).toEqual(['connectionString3']);
    });
});
