/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { NotificationType } from '../../api/models/notification';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { CONNECTION_STRING_LIST, CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { getConnectionStringsAction } from './../actions';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ConnectionStringWithExpiry } from '../state';
import { setConnectionStrings } from './setConnectionStringsSaga';

export function* getConnectionStringsSaga() {
    const connectionStrings = yield call(getConnectionStrings);
    yield put(getConnectionStringsAction.done({result: connectionStrings}));
}

export function* getConnectionStrings() {
    const connectionStrings = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    if (connectionStrings) {
        // due to security requirements, we are removing old hub connection strings added with no expiry
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.connectionStringsWithoutExpiryRemovalWarning
            },
            type: NotificationType.warning
        });
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, '');
    }

    const connectionStringsWithExpiry = localStorage.getItem(CONNECTION_STRING_LIST);
    // check expiration, delete and notify
    const result: ConnectionStringWithExpiry[] = connectionStringsWithExpiry && JSON.parse(connectionStringsWithExpiry) || [];
    const filteredResult = result.filter(s => new Date() < new Date(s.expiration));
    if (filteredResult.length < result.length) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.connectionStringsWithExpiryRemovalWarning
            },
            type: NotificationType.warning
        });
        yield call(setConnectionStrings, filteredResult);
    }
    return filteredResult;
}
