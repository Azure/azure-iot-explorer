/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SET_CONNECTION_STRING } from '../constants/actionTypes';
import { connectionStateInitial } from './state';
import connectionStateReducer from './reducer';
import { setConnectionStringAction, logoutAction } from './actions';
import { REMEMBER_CONNECTION_STRING, CONNECTION_STRING_NAME_LIST, REPO_LOCATIONS, PRIVATE_REPO_CONNECTION_STRING_NAME } from '../constants/browserStorage';

describe('connectionStateReducers', () => {
    it (`handles ${SET_CONNECTION_STRING} action and remembers the connection string`, () => {
        const connectionString = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=test';
        const payload = {
            connectionString,
            rememberConnectionString: true
        };
        const action = setConnectionStringAction(payload);
        expect(connectionStateReducer(connectionStateInitial(), action).connectionString).toEqual(connectionString);
        expect(connectionStateReducer(connectionStateInitial(), action).rememberConnectionString).toEqual(true);
        expect(localStorage.getItem(REMEMBER_CONNECTION_STRING)).toEqual('true');
        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toEqual(connectionString);
    });

    it (`handles ${SET_CONNECTION_STRING} action and won't remember the connection string`, () => {
        const connectionString = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=test';
        const payload = {
            connectionString,
            rememberConnectionString: false
        };
        const action = setConnectionStringAction(payload);
        expect(connectionStateReducer(connectionStateInitial(), action).connectionString).toEqual(connectionString);
        expect(connectionStateReducer(connectionStateInitial(), action).rememberConnectionString).toEqual(false);
        expect(localStorage.getItem(REMEMBER_CONNECTION_STRING)).toEqual('false');
        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toEqual('');
    });

    it('handles log out action', () => {
        localStorage.setItem(REPO_LOCATIONS, 'PRIVATE,PUBLIC,DEVICE');
        localStorage.setItem(REMEMBER_CONNECTION_STRING, 'true');
        localStorage.setItem(PRIVATE_REPO_CONNECTION_STRING_NAME, 'HostName=privaterepo.com;RepositoryId=1234');
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, 'HostName=test1.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=test,HostName=test2.azure-devices.net;SharedAccessKeyName=iothubreader;SharedAccessKey=test')
        const action = logoutAction();

        expect(connectionStateReducer(connectionStateInitial(), action).connectionString).toEqual('');
        expect(connectionStateReducer(connectionStateInitial(), action).rememberConnectionString).toBeFalsy();
        expect(localStorage.getItem(REPO_LOCATIONS)).toBeNull();
        expect(localStorage.getItem(REMEMBER_CONNECTION_STRING)).toBeNull();
        expect(localStorage.getItem(PRIVATE_REPO_CONNECTION_STRING_NAME)).toBeNull();
        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toBeNull();

    });
});
