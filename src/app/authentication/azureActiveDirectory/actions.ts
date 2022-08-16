/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { IotHubDescription } from '../../api/models/iotHubDescription';
import { AzureSubscription } from '../../api/models/azureSubscription';

export interface GetIotHubKeyActionParmas {
    hubId: string;
    hubName: string;
}

const actionCreator = actionCreatorFactory('AAD');
export const getIotHubsBySubscriptionAction = actionCreator.async<string, IotHubDescription[]>('GET_IOTHUBS');
export const getIoTHubKeyAction = actionCreator.async<GetIotHubKeyActionParmas, string>('GET_HUBKEY');
export const getSubscriptionListAction = actionCreator.async<void, AzureSubscription[]>('GET_SUBSCRIPTIONS');
export const getUserProfileTokenAction = actionCreator.async<void, string>('GET_TOKEN');
export const loginAction = actionCreator.async<void, void>('LOGIN');
export const logoutAction = actionCreator.async<void, void>('LOGOUT');
