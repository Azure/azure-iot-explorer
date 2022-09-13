/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { authenticationReducer } from './reducers';
import { getLoginPreferenceAction, setLoginPreferenceAction } from './actions';
import { getInitialAuthenticationState, AuthenticationMethodPreference } from './state';

describe('authenticationReducer', () => {
    context('AUTHENTICATION/GET', () => {
        it('handles AUTHENTICATION/GET_STARTED action', ()=> {
            const action = getLoginPreferenceAction.started();
            expect(authenticationReducer(getInitialAuthenticationState(), action).formState).toEqual('working');
        });

        it('handles AUTHENTICATION/GET_DONE action', ()=> {
            const action = getLoginPreferenceAction.done({result: AuthenticationMethodPreference.AzureAD});
            expect(authenticationReducer(getInitialAuthenticationState(), action)).toEqual({
                formState: 'idle',
                preference: AuthenticationMethodPreference.AzureAD
            });
        });

        it('handles AUTHENTICATION/GET_FAILED action', ()=> {
            const action = getLoginPreferenceAction.failed({error: {}});
            expect(authenticationReducer(getInitialAuthenticationState(), action).formState).toEqual('failed');
        });
    });

    context('AUTHENTICATION/SET', () => {
        it('handles AUTHENTICATION/SET_STARTED action', ()=> {
            const action = setLoginPreferenceAction.started(AuthenticationMethodPreference.AzureAD);
            expect(authenticationReducer(getInitialAuthenticationState(), action).formState).toEqual('working');
        });

        it('handles AUTHENTICATION/SET_DONE action', ()=> {
            const action = setLoginPreferenceAction.done({params: AuthenticationMethodPreference.AzureAD});
            expect(authenticationReducer(getInitialAuthenticationState(), action)).toEqual({
                formState: 'idle',
                preference: AuthenticationMethodPreference.AzureAD
            });
        });

        it('handles AUTHENTICATION/SET_FAILED action', ()=> {
            const action = setLoginPreferenceAction.failed({params: AuthenticationMethodPreference.AzureAD, error: {}});
            expect(authenticationReducer(getInitialAuthenticationState(), action).formState).toEqual('failed');
        });
    });
});

