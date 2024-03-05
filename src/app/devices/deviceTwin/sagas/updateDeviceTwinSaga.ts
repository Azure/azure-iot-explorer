/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { updateDeviceTwin } from '../../../api/services/devicesService';
import { NotificationType } from '../../../api/models/notification';
import { UpdateDeviceTwinParameters } from '../../../api/parameters/deviceParameters';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { updateDeviceTwinAction } from '../actions';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

export function* updateDeviceTwinSaga(action: Action<UpdateDeviceTwinParameters>): SagaIterator {
    try {
        const twin = yield call(updateDeviceTwin, action.payload);

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceTwinOnSuccess,
                translationOptions: {
                    deviceId: action.payload.twin.deviceId
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
                    deviceId: action.payload.twin.deviceId,
                    error,
                },
            },
            type: NotificationType.error
          });

        yield put(updateDeviceTwinAction.failed({params: action.payload, error}));
    }
}
