/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { select } from 'redux-saga/effects';
import { StateInterface } from '../../shared/redux/state';
import { AzureResource } from '../models/azureResource';
import { getConnectionStringSelector } from './../../login/selectors';

// tslint:disable-next-line:no-any  [any required until redux-saga brought to 1.0.0+ -- cloneablegenerator type does not allow mixed return (e.g. iterator and non-iterator)]
export function* getActiveAzureResourceConnectionStringSaga(): any {
    const activeAzureResource: AzureResource = yield select(getActiveAzureResource);

    if (!activeAzureResource) {
        return '';
    }

    return activeAzureResource.connectionString;
    // todo implement sas lookup once msal implemented.
}

export const getActiveAzureResource = (state: StateInterface) => {
    return state.azureResourceState.activeAzureResource;
};
