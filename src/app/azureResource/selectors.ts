/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { StateInterface } from '../shared/redux/state';
import { AzureResource } from './models/azureResource';

export const getActiveAzureResourceSelector = (state: StateInterface): AzureResource => {
    return state.azureResourceState.activeAzureResource;
};

export const getActiveAzureResourceHostNameSelector = createSelector(getActiveAzureResourceSelector, resource => resource && (resource.hostName || ''));

export const getActiveAzureResourceConnectionStringSelector = createSelector(getActiveAzureResourceSelector, resource => resource && (resource.connectionString || ''));
