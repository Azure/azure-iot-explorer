/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, select, put } from 'redux-saga/effects';
import { setSharedAccessSignatureAuthorizationRulesAction } from '../actions';
import { getSharedAccessSignatureAuthorizationRules } from '../services/iotHubService';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';
import { executeAzureResourceManagementTokenRequest } from '../../login/services/authService';
import { appConfig } from '../../../appConfig/appConfig';
import { StateInterface } from '../../shared/redux/state';
import { CacheWrapper } from '../../api/models/cacheWrapper';
import {  MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '../../api/constants';

const cacheInMinutes = 4;
export const cacheRetentionInMilliseconds = cacheInMinutes * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export function* getSharedAccessSignatureAuthorizationRulesSaga(azureResourceIdentifier: AzureResourceIdentifier) {

    const cachedSharedAccessSignatureAuthorizationRules: Map<string, CacheWrapper<SharedAccessSignatureAuthorizationRule[]>> = yield select(getSharedAccessSignatureAuthorizationRulesCache);

    if (cachedSharedAccessSignatureAuthorizationRules.has(azureResourceIdentifier.name)) {
        const iotHubRulesWrapper = cachedSharedAccessSignatureAuthorizationRules.get(azureResourceIdentifier.name);
        const cacheAgeInMilliseconds = Date.now() - iotHubRulesWrapper.lastSynchronized;

        if (cacheAgeInMilliseconds <= cacheRetentionInMilliseconds) {
            return iotHubRulesWrapper.payload;
        }
    }

    const endpoint: string = yield call(getAzureResourceManagementEndpoint);
    const authorizationToken: string = yield call(executeAzureResourceManagementTokenRequest);

    const sharedAccessSignatureAuthorizationRules: SharedAccessSignatureAuthorizationRule[] = yield call(getSharedAccessSignatureAuthorizationRules, {
        azureResourceIdentifier,
        azureResourceManagementEndpoint: {
            authorizationToken,
            endpoint
        }
    });

    yield put(setSharedAccessSignatureAuthorizationRulesAction({
        hubName: azureResourceIdentifier.name,
        sharedAccessSignatureAuthorizationRules
    }));

    return sharedAccessSignatureAuthorizationRules;
}

export const getSharedAccessSignatureAuthorizationRulesCache = (state: StateInterface) => {
    return state.iotHubState.sharedAccessSignatureAuthorizationRules;
};

export const getAzureResourceManagementEndpoint = (): string => {
    return appConfig.azureResourceManagementEndpoint;
};
