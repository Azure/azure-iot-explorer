/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { addDeviceAction } from './actions';
import { addDevice } from '../../api/services/devicesService';
import { AddDeviceParameters } from '../../api/parameters/deviceParameters';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';

export function* addDeviceSagaWorker(action: Action<AddDeviceParameters>): SagaIterator {
    try {
        const result = yield call(addDevice, action.payload);

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.addDeviceOnSucceed,
                translationOptions: {
                    deviceId: action.payload.deviceIdentity.deviceId
                },
            },
            type: NotificationType.success
        });

        yield put(addDeviceAction.done({params: action.payload, result}));
    } catch (error) {

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.addDeviceOnError,
                translationOptions: {
                    deviceId: action.payload.deviceIdentity.deviceId,
                    error,
                },
            },
            type: NotificationType.error
        });

        yield put(addDeviceAction.failed({params: action.payload, error}));
    }
}

export function* addDeviceSaga() {
    yield takeEvery(addDeviceAction.started.type, addDeviceSagaWorker);
}
