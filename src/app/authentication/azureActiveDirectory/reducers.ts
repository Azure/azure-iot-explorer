/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { getUserProfileTokenAction, loginAction, logoutAction, getSubscriptionListAction, getIotHubsBySubscriptionAction, getIoTHubKeyAction, GetIotHubKeyActionParmas } from './actions';
import { getInitialAzureActiveDirectoryState, AzureActiveDirectoryStateInterface } from './state';
import { AzureSubscription } from '../../api/models/azureSubscription';
import { IotHubDescription } from '../../api/models/iotHubDescription';

export const azureActiveDirectoryReducer = reducerWithInitialState<AzureActiveDirectoryStateInterface>(getInitialAzureActiveDirectoryState())
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
    })
    .case(getSubscriptionListAction.started, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'working'
        };
    })
    .case(getSubscriptionListAction.done, (state: AzureActiveDirectoryStateInterface, payload: {result: AzureSubscription[]}) => {
        return {
            ...state,
            formState: 'idle',
            subscriptions: payload.result
        };
    })
    .case(getSubscriptionListAction.failed, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    })
    .case(getIotHubsBySubscriptionAction.started, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'working'
        };
    })
    .case(getIotHubsBySubscriptionAction.done, (state: AzureActiveDirectoryStateInterface, payload: {params: string, result: IotHubDescription[]}) => {
        return {
            ...state,
            formState: 'idle',
            iotHubs: payload.result
        };
    })
    .case(getIotHubsBySubscriptionAction.failed, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    })
    .case(getIoTHubKeyAction.started, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'working'
        };
    })
    .case(getIoTHubKeyAction.done, (state: AzureActiveDirectoryStateInterface, payload: {params: GetIotHubKeyActionParmas, result: string}) => {
        return {
            ...state,
            formState: 'keyPicked',
            iotHubKey: payload.result
        };
    })
    .case(getIoTHubKeyAction.failed, (state: AzureActiveDirectoryStateInterface) => {
        return {
            ...state,
            formState: 'failed'
        };
    });
