/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SET_CONNECTION_STRING } from '../constants/actionTypes';
import { connectionStateInitial } from './state';
import connectionStateReducer from './reducer';
import { setConnectionStringAction } from './actions';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';

describe('connectionStateReducers', () => {
    it (`handles ${SET_CONNECTION_STRING} action and remembers the connection string`, () => {
        const connectionString = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=test';
        const payload = {
            connectionString,
            connectionStringList: [connectionString]
        };
        const action = setConnectionStringAction(payload);
        expect(connectionStateReducer(connectionStateInitial(), action).connectionString).toEqual(connectionString);
        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toEqual(connectionString);
    });
});
