/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { getConnectionStringSelector, getConnectionStringListSelector } from './selectors';
import { getInitialState } from '../api/shared/testHelper';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';

describe('getDigitalTwinInterfacePropertiesSelector', () => {

    const state = getInitialState();

    state.connectionState = Record({
        connectionString: 'testConnectionString'
    })();

    it('returns connection string from state', () => {
        expect(getConnectionStringSelector(state)).toEqual('testConnectionString');
    });

    it('returns connection string list', () => {
        localStorage.removeItem(CONNECTION_STRING_NAME_LIST);
        expect(getConnectionStringListSelector()).toEqual([]);

        localStorage.setItem(CONNECTION_STRING_NAME_LIST, ['testConnectionString1', 'testConnectionString2'].join(','));
        expect(getConnectionStringListSelector()).toEqual(localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(','));
    });
});
