/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { fetchDeviceTwin } from '../../../api/services/devicesService';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceTwinAction } from '../actions';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

export function* getDeviceTwinSaga(action: Action<string>): SagaIterator {
    try {
        const parameters = {
            deviceId: action.payload,
        };

        const twin = yield call(fetchDeviceTwin, parameters);

        yield put(getDeviceTwinAction.done({params: action.payload, result: twin}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.getDeviceTwinOnError,
                translationOptions: {
                    deviceId: action.payload,
                    error,
                },
            },
            type: NotificationType.error
          });

        yield put(getDeviceTwinAction.failed({params: action.payload, error}));
    }
}
