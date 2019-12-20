/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { select } from 'redux-saga/effects';
import { StateInterface } from '../../shared/redux/state';
import { AzureResource } from '../models/azureResource';

export function* getActiveAzureResourceConnectionStringSaga() {
    const activeAzureResource: AzureResource = yield select((state: StateInterface) => state.azureResourceState.activeAzureResource);

    if (!activeAzureResource) {
        return '';
    }

    if (activeAzureResource.connectionString) {
        return activeAzureResource.connectionString;
    }

    // todo implement sas lookup once msal implemented.

    return '';
}
