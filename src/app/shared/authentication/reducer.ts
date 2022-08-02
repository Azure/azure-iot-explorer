/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { getAuthenticatinTokenAction } from './actions';
import { authenticationStateInitial, AuthenticationStateType } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

export const authenticationReducer = reducerWithInitialState<AuthenticationStateType>(authenticationStateInitial())
    .case(getAuthenticatinTokenAction.started, (state: AuthenticationStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(getAuthenticatinTokenAction.done, (state: AuthenticationStateType, payload: {params: void, result: string}) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.fetched,
            token: payload.result
        });
    });
