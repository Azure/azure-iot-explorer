/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { getAzureSubscriptions } from '../../../api/services/azureSubscriptionService';
import { getSubscriptionListAction } from '../actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { AzureSubscription } from '../../../api/models/azureSubscription';
import { appConfig } from '../../../../appConfig/appConfig';
import { getTenantToken } from '../../../api/services/authenticationService';

export function* getSubscriptionListSaga(action: Action<string>) {
    const tenantId = action.payload;
    try {
        const authorizationToken: string = yield call(getTenantToken, tenantId);
        const result: AzureSubscription[] = yield call(getAzureSubscriptions, {
            authorizationToken,
            endpoint: appConfig.azureResourceManagementEndpoint
        });
        yield put(getSubscriptionListAction.done({params: tenantId, result: result.sort((a, b) => a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1 : -1)}));
    }
    catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getsubscriptionListError,
                translationOptions: {
                    error: error?.message || error
                }
            },
            type: NotificationType.error
        });

        yield put(getSubscriptionListAction.failed({params: tenantId, error}));
    }
}
