/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { SET } from '../constants/actionTypes';
import { AzureResource } from './models/azureResource';

export const AZURE_RESOURCES = 'AZURE_RESOURCES';
export const BY_CONNECTION = '_CONNECTION';
export const BY_HOSTNAME = '_HOST';

const actionCreator = actionCreatorFactory(AZURE_RESOURCES);

export interface SetActiveAzureResourceByConnectionStringActionParameters {
    connectionString: string;
    connectionStringList: string[];
    hostName: string;
}

export interface SetActiveAzureResourceByHostNameActionParameters {
    hostName: string;
}

export const setActiveAzureResourceByConnectionStringAction = actionCreator<SetActiveAzureResourceByConnectionStringActionParameters>(`${SET}${BY_CONNECTION}`);
export const setActiveAzureResourceByHostNameAction = actionCreator<SetActiveAzureResourceByHostNameActionParameters>(`${SET}${BY_HOSTNAME}`);
export const setActiveAzureResourceAction = actionCreator<AzureResource>(SET);
