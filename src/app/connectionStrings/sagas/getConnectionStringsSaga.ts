/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { NotificationType } from '../../api/models/notification';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { getConnectionStringsAction } from '../actions';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ConnectionStringWithExpiry } from '../state';
import { setConnectionStrings } from './setConnectionStringsSaga';
import { getConnectionStrings as getStoredConnectionStrings, deleteConnectionStrings } from '../../shared/utils/credentialStorage';

export function* getConnectionStringsSaga(): SagaIterator {
    const connectionStrings = yield call(getConnectionStrings);
    yield put(getConnectionStringsAction.done({result: connectionStrings}));
}

// tslint:disable-next-line: cyclomatic-complexity
export function* getConnectionStrings(): SagaIterator {
    const result: ConnectionStringWithExpiry[] = yield call(getStoredConnectionStrings);
    if (result && result.length > 0) {
        try {
            // check expiration, delete and notify
            const filteredResult = result.filter(s => new Date() < new Date(s.expiration)) || [];
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
        catch
        {
            // connection strings stored can not be parsed to ConnectionStringWithExpiry Array
            // Currently it is possible that user has old format connection strings stored
            yield call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.connectionStringsWithoutExpiryRemovalWarning
                },
                type: NotificationType.warning
            });
            yield call(deleteConnectionStrings);
            return [];
        }
    }
    return [];
}
