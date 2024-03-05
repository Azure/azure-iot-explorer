/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { updateDeviceTwin } from '../../../api/services/devicesService';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { updateDeviceTwinAction } from '../actions';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { Twin } from '../../../api/models/device';

export function* updateDeviceTwinSaga(action: Action<Twin>): SagaIterator {
    try {
        const twin = yield call(updateDeviceTwin, action.payload, 'todo');

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceTwinOnSuccess,
                translationOptions: {
                    deviceId: action.payload.deviceId
                },
            },
            type: NotificationType.success
          });

        yield put(updateDeviceTwinAction.done({params: action.payload, result: twin}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceTwinOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
          });

        yield put(updateDeviceTwinAction.failed({params: action.payload, error}));
    }
}
