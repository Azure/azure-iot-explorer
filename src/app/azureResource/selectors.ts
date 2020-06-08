/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { AzureResource } from './models/azureResource';
import { AzureResourceStateInterface } from './state';

export const getActiveAzureResourceSelector = (state: AzureResourceStateInterface): AzureResource => {
    return state.activeAzureResource;
};

export const getActiveAzureResourceHostNameSelector = createSelector(getActiveAzureResourceSelector, resource => resource && (resource.hostName || ''));

export const getActiveAzureResourceConnectionStringSelector = createSelector(getActiveAzureResourceSelector, resource => resource && (resource.connectionString || ''));
