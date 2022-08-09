/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { login } from '../../../api/services/authenticationService';
import { loginAction } from '../actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

export function* loginSaga() {
    try {
        yield call(login);
        yield put(loginAction.done({}));
    }
    catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.loginError
            },
            type: NotificationType.error
        });

        yield put(loginAction.failed({error}));
    }
}
