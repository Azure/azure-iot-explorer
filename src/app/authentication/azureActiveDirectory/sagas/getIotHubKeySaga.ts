/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { getIotHubKeys } from '../../../api/services/iotHubService';
import { getIoTHubKeyAction, GetIotHubKeyActionParmas } from '../actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { appConfig } from '../../../../appConfig/appConfig';
import { getProfileToken } from '../../../api/services/authenticationService';
import { CONNECTION_STRING_THROUGH_AAD } from '../../../constants/browserStorage';
import { SharedAccessSignatureAuthorizationRule, AccessRights } from '../../../api/models/sharedAccessSignatureAuthorizationRule';

export function* getIotHubKeySaga(action: Action<GetIotHubKeyActionParmas>) {
    try {
        const authorizationToken: string = yield call(getProfileToken); // always get a fresh token to prevent expiration
        const results: SharedAccessSignatureAuthorizationRule[] = yield call(getIotHubKeys, {
            authorizationToken,
            endpoint: appConfig.azureResourceManagementEndpoint,
            hubId: action.payload.hubId
        });

        const filtered = results.filter(element => filterKey(element.rights));
        if (!filtered || !filtered.length) {
            throw new Error();
        }

        const result = formatConnectionString(action.payload.hubName, filtered[0]);
        localStorage.setItem(CONNECTION_STRING_THROUGH_AAD, result);
        yield put(getIoTHubKeyAction.done({params: action.payload, result}));
    }
    catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getIotHubKeyError,
                translationOptions: {
                    error: error?.message || error
                }
            },
            type: NotificationType.error
        });

        yield put(getIoTHubKeyAction.failed({params: action.payload, error}));
    }
}

export const filterKey = (rights: string) => {
    const rightArray = rights.split(',').map(element => element.trim());
    return rightArray.includes(AccessRights.DeviceConnect) &&
        rightArray.includes(AccessRights.RegistryWrite) &&
        rightArray.includes(AccessRights.ServiceConnect);
};

export const formatConnectionString = (hubName: string, authRule: SharedAccessSignatureAuthorizationRule) => {
    return  `HostName=${hubName}.azure-devices.net;SharedAccessKeyName=${authRule.keyName};SharedAccessKey=${authRule.primaryKey}`;
};
