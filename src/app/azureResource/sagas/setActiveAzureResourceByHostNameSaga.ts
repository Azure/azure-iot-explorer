/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { call, put, select } from 'redux-saga/effects';
import { setActiveAzureResourceAction, SetActiveAzureResourceByHostNameActionParameters } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import { StateInterface } from '../../shared/redux/state';
import { executeAzureResourceManagementTokenRequest } from '../../login/services/authService';
import { appConfig, AuthMode } from '../../../appConfig/appConfig';
import { AzureSubscription } from '../../azureResourceIdentifier/models/azureSubscription';
import { getAzureSubscriptions } from '../../azureResourceIdentifier/services/azureSubscriptionService';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { getResourceNameFromHostName, getResourceTypeFromHostName, tryGetHostNameFromConnectionString } from '../../api/shared/hostNameUtils';
import { getAzureResourceIdentifier } from '../../azureResourceIdentifier/services/azureResourceIdentifierService';

export function* setActiveAzureResourceByHostNameSaga(action: Action<SetActiveAzureResourceByHostNameActionParameters>) {
    const { hostName } = action.payload;

    if (!hostName) {
        yield put(setActiveAzureResourceAction({
            accessVerificationState: AccessVerificationState.Failed,
            hostName
        }));
        return;
    }

    const authMode = yield call(getAuthMode);

    if (authMode === AuthMode.ConnectionString) {
        yield call(setActiveAzureResourceByHostNameSaga_ConnectionString, hostName);
        return;
    }

    yield call(setActiveAzureResourceByHostNameSaga_ImplicitFlow, hostName);
}

export function* setActiveAzureResourceByHostNameSaga_ConnectionString(hostName: string) {
    const connectionString  = yield select(getLastUsedConnectionString);
    const connectionStringHostName = yield call(tryGetHostNameFromConnectionString, connectionString);

    if (hostName.toLowerCase() === connectionStringHostName.toLowerCase()) {
        yield put(setActiveAzureResourceAction({
            accessVerificationState: AccessVerificationState.Authorized,
            connectionString,
            hostName
        }));
    } else {
        yield put(setActiveAzureResourceAction({
            accessVerificationState: AccessVerificationState.Unauthorized,
            hostName
        }));
    }
}

export function* setActiveAzureResourceByHostNameSaga_ImplicitFlow(hostName: string) {
    try {
        const endpoint: string = yield call(getAzureResourceManagementEndpoint);
        const authorizationToken: string = yield call(executeAzureResourceManagementTokenRequest);
        const subscriptions: AzureSubscription[] = yield call(getAzureSubscriptions, {
            azureResourceManagementEndpoint: {
                authorizationToken,
                endpoint
            }
        });

        const azureResourceIdentifier: AzureResourceIdentifier = yield call(getAzureResourceIdentifier, {
            azureResourceManagementEndpoint: {
                authorizationToken,
                endpoint
            },
            resourceName: getResourceNameFromHostName(hostName),
            resourceType: getResourceTypeFromHostName(hostName),
            subscriptionIds: subscriptions.map(s => s.subscriptionId)
        });

        yield put(setActiveAzureResourceAction({
            accessVerificationState: azureResourceIdentifier ? AccessVerificationState.Authorized : AccessVerificationState.Unauthorized,
            azureResourceIdentifier,
            hostName
        }));

    } catch {
        yield put(setActiveAzureResourceAction({
            accessVerificationState: AccessVerificationState.Failed,
            hostName
        }));
    }
}

export const getAuthMode = (): AuthMode => {
    return appConfig.authMode;
};

export const getAzureResourceManagementEndpoint = (): string => {
    return appConfig.azureResourceManagementEndpoint;
};

export const getLastUsedConnectionString = (state: StateInterface): string => {
    return state.connectionStringsState.connectionStrings.length > 0 ? state.connectionStringsState.connectionStrings[0] : '';
};
