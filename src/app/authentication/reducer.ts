/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { getLoginPreferenceAction, setLoginPreferenceAction } from './actions';
import { getInitialAuthenticateState, AuthenticationStateInterface, AuthenticationMethodPreference } from './state';

export const authenticationReducer = reducerWithInitialState<AuthenticationStateInterface>(getInitialAuthenticateState())
    .case(getLoginPreferenceAction.started, (state: AuthenticationStateInterface) => {
        return {
            ...state,
            formState: 'working'
        };
    })
    .case(getLoginPreferenceAction.done, (state: AuthenticationStateInterface, payload: {params: void, result: AuthenticationMethodPreference}) => {
        return {
            ...state,
            formState: 'idle',
            preference: payload.result
        };
    })
    .case(getLoginPreferenceAction.failed, (state: AuthenticationStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    })
    .case(setLoginPreferenceAction.started, (state: AuthenticationStateInterface) => {
        return {
            ...state,
            formState: 'working'
        };
    })
    .case(setLoginPreferenceAction.done, (state: AuthenticationStateInterface, payload: {params: AuthenticationMethodPreference}) => {
        return {
            ...state,
            formState: 'idle',
            preference: payload.params
        };
    })
    .case(setLoginPreferenceAction.failed, (state: AuthenticationStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    });
