/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { select, call } from 'redux-saga/effects';
import { StateInterface } from '../../shared/redux/state';
import { AzureResource } from '../models/azureResource';
import { appConfig, AuthMode } from '../../../appConfig/appConfig';
import { AzureResourceIdentifierType } from '../../azureResourceIdentifier/models/azureResourceIdentifierType';
import { getConnectionStringFromIotHubSaga } from '../../iotHub/sagas/getConnectionStringFromIotHubSaga';

export function* getActiveAzureResourceConnectionStringSaga() {
    const activeAzureResource: AzureResource = yield select(getActiveAzureResource);
    if (!activeAzureResource) {
        return '';
    }

    const authMode = yield call(getAuthMode);
    if (authMode === AuthMode.ConnectionString) {
        return activeAzureResource.connectionString;
    }

    if (activeAzureResource.azureResourceIdentifier &&
        activeAzureResource.azureResourceIdentifier.type === AzureResourceIdentifierType.IotHub) {
        const connectionString = yield call(getConnectionStringFromIotHubSaga, activeAzureResource.azureResourceIdentifier);
        return connectionString;
    }

    return '';
}

export const getActiveAzureResource = (state: StateInterface) => {
    return state.azureResourceState.activeAzureResource;
};

export const getAuthMode = (): AuthMode => {
    return appConfig.authMode;
};
