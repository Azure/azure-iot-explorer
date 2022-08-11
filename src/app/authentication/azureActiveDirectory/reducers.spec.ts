/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { azureActiveDirectoryReducer } from './reducers';
import { getUserProfileTokenAction, loginAction, logoutAction } from './actions';
import { getInitialAzureActiveDirectoryState } from './state';

describe('azureActiveDirectoryReducer', () => {
    context('AAD/GET_TOKEN', () => {
        it('handles AAD/GET_TOKEN_STARTED action', ()=> {
            const action = getUserProfileTokenAction.started();
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/GET_TOKEN_DONE action', ()=> {
            const action = getUserProfileTokenAction.done({result: 'user_token_123'});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action)).toEqual({
                formState: 'idle',
                token: 'user_token_123'
            });
        });

        it('handles AAD/GET_TOKEN_FAILED action', ()=> {
            const action = getUserProfileTokenAction.failed({error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });

    context('AAD/LOGIN', () => {
        it('handles AAD/LOGIN_STARTED action', ()=> {
            const action = loginAction.started();
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/LOGIN_DONE action', ()=> {
            const action = loginAction.done({});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action)).toEqual({
                formState: 'idle'
            });
        });

        it('handles AAD/LOGIN_FAILED action', ()=> {
            const action = loginAction.failed({error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });

    context('AAD/LOGOUT', () => {
        it('handles AAD/LOGOUT_STARTED action', ()=> {
            const action = logoutAction.started();
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/LOGOUT_DONE action', ()=> {
            const action = logoutAction.done({});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action)).toEqual({
                formState: 'idle'
            });
        });

        it('handles AAD/LOGOUT_FAILED action', ()=> {
            const action = logoutAction.failed({error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });
});

