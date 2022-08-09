/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { logout } from '../../../api/services/authenticationService';
import { logoutAction } from '../actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

export function* logoutSaga() {
    try {
        yield call(logout);
        yield put(logoutAction.done({}));
    }
    catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.logoutError
            },
            type: NotificationType.error
        });

        yield put(logoutAction.failed({error}));
    }
}
