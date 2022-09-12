/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { getIotHubsBySubscription } from '../../../api/services/iotHubService';
import { getIotHubsBySubscriptionAction } from '../actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { IotHubDescription } from '../../../api/models/iotHubDescription';
import { appConfig } from '../../../../appConfig/appConfig';
import { getProfileToken } from '../../../api/services/authenticationService';

export function* getIotHubListSaga(action: Action<string>) {
    try {
        const authorizationToken: string = yield call(getProfileToken); // always get a fresh token to prevent expiration
        const result: IotHubDescription[] = yield call(getIotHubsBySubscription, {
            authorizationToken,
            endpoint: appConfig.azureResourceManagementEndpoint,
            subscriptionId: action.payload
        });
        yield put(getIotHubsBySubscriptionAction.done({params: action.payload, result: result.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)}));
    }
    catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getIotHubListError,
                translationOptions: {
                    error: error?.message || error
                }
            },
            type: NotificationType.error
        });

        yield put(getIotHubsBySubscriptionAction.failed({params: action.payload, error}));
    }
}
