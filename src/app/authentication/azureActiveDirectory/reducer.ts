/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { getUserProfileTokenAction, loginAction, logoutAction } from './actions';
import { getInitialAzureActiveDirectoryStateInitial, AzureActiveDirectoryStateInterface } from './state';

export const azureActiveDirectoryReducer = reducerWithInitialState<AzureActiveDirectoryStateInterface>(getInitialAzureActiveDirectoryStateInitial())
    .case(getUserProfileTokenAction.started, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'working'
        };
    })
    .case(getUserProfileTokenAction.done, (state: AzureActiveDirectoryStateInterface, payload: {params: void, result: string}) => {
        return {
            ...state,
            formState: 'idle',
            token: payload.result
        };
    })
    .case(getUserProfileTokenAction.failed, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    })
    .case(loginAction.started, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'working',
        };
    })
    .case(loginAction.done, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'idle',
        };
    })
    .case(loginAction.failed, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    })
    .case(logoutAction.started, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'working',
        };
    })
    .case(logoutAction.done, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'idle',
        };
    })
    .case(logoutAction.failed, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    });
