/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { getAzureTenants } from '../../../api/services/azureTenantService';
import { getTenantListAction } from '../actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { AzureTenant } from '../../../api/models/azureTenant';
import { appConfig } from '../../../../appConfig/appConfig';
import { getProfileToken } from '../../../api/services/authenticationService';

export function* getTenantListSaga() {
    try {
        const authorizationToken: string = yield call(getProfileToken);
        const result: AzureTenant[] = yield call(getAzureTenants, {
            authorizationToken,
            endpoint: appConfig.azureResourceManagementEndpoint
        });
        yield put(getTenantListAction.done({result: result.sort((a, b) => {
            const aName = (a.displayName || a.defaultDomain || '').toLowerCase();
            const bName = (b.displayName || b.defaultDomain || '').toLowerCase();
            return aName > bName ? 1 : -1;
        })}));
    }
    catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getTenantListError,
                translationOptions: {
                    error: error?.message || error
                }
            },
            type: NotificationType.error
        });

        yield put(getTenantListAction.failed({error}));
    }
}
