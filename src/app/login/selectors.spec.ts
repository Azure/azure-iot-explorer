/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { getConnectionStringSelector, getRememberConnectionStringValueSelector, getConnectionStringListSelector } from './selectors';
import { getInitialState } from '../api/shared/testHelper';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';

describe('getDigitalTwinInterfacePropertiesSelector', () => {

    const state = getInitialState();

    state.connectionState = Record({
        connectionString: 'testConnectionString',
        rememberConnectionString: false
    })();

    it('returns connection string from state', () => {
        expect(getConnectionStringSelector(state)).toEqual('testConnectionString');
    });

    it('returns rememberConnectionString from state', () => {
        expect(getRememberConnectionStringValueSelector(state)).toEqual(false);
    });

    it('returns connection string list based if remembering connection string', () => {
        expect(getConnectionStringListSelector(state)).toEqual(['testConnectionString']);

        state.connectionState = Record({
            connectionString: 'testConnectionString',
            rememberConnectionString: true
        })();

        expect(getConnectionStringListSelector(state)).toEqual(localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(','));
    });
});
