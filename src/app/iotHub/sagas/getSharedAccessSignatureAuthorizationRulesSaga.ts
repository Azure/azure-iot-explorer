/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, select, put } from 'redux-saga/effects';
import { setSharedAccessSignatureAuthorizationRules } from '../actions';
import { getSharedAccessPolicies } from '../services/iotHubService';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';
import { executeAzureResourceManagementTokenRequest } from '../../login/services/authService';
import { appConfig } from '../../../appConfig/appConfig';
import { StateInterface } from '../../shared/redux/state';
import { LastRetrievedWrapper } from '../../api/models/lastRetrievedWrapper';

const cacheInMinutes = 4;
const secondsPerMinute = 60;
const millisecondsPerSecond = 1000;
export const cacheRetention = cacheInMinutes * secondsPerMinute * millisecondsPerSecond;

export function* getSharedAccessSignatureAuthorizationRules(azureResourceIdentifier: AzureResourceIdentifier) {

    const cachedSharedAccessSignatureAuthorizationRules: Map<string, LastRetrievedWrapper<SharedAccessSignatureAuthorizationRule[]>> = yield select((state : StateInterface) => state.);

    if (cachedSharedAccessSignatureAuthorizationRules.has(azureResourceIdentifier.name)) {
        const iotHubRulesWrapper = cachedSharedAccessSignatureAuthorizationRules.get(azureResourceIdentifier.name);
        const cacheDuration = Date.now() - iotHubRulesWrapper.lastRetrieved;

        if (cacheDuration <= cacheRetention) {
            return iotHubRulesWrapper.payload;
        }
    }

    const endpoint: string = yield call(getAzureResourceManagementEndpoint);
    const authorizationToken: string = yield call(executeAzureResourceManagementTokenRequest);

    const sharedAccessSignatureAuthorizationRules: SharedAccessSignatureAuthorizationRule[] = yield call(getSharedAccessPolicies, {
        azureResourceIdentifier,
        azureResourceManagementEndpoint: {
            authorizationToken,
            endpoint
        }
    });

    yield put(setSharedAccessSignatureAuthorizationRules({
        hubName: azureResourceIdentifier.name,
        sharedAccessSignatureAuthorizationRules
    }));

    return sharedAccessSignatureAuthorizationRules;
}

export const getAzureResourceManagementEndpoint = (): string => {
    return appConfig.azureResourceManagementEndpoint;
};
