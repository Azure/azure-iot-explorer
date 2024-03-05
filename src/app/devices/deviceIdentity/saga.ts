/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, all, takeLatest, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { fetchDevice, updateDevice } from '../../api/services/devicesService';
import { NotificationType } from '../../api/models/notification';
import { FetchDeviceParameters, UpdateDeviceParameters } from '../../api/parameters/deviceParameters';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from './actions';

export function* getDeviceIdentitySagaWorker(action: Action<FetchDeviceParameters>): SagaIterator {
    try {
        const deviceIdentity = yield call(fetchDevice, action.payload);
        yield put(getDeviceIdentityAction.done({params: action.payload, result: deviceIdentity}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.getDeviceIdentityOnError,
                translationOptions: {
                    deviceId: action.payload,
                    error,
                },
            },
            type: NotificationType.error
        });

        yield put(getDeviceIdentityAction.failed({params: action.payload, error}));
    }
}

export function* updateDeviceIdentitySagaWorker(action: Action<UpdateDeviceParameters>): SagaIterator {
    try {
        const deviceIdentity = yield call(updateDevice, action.payload);
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceOnSucceed,
                translationOptions: {
                   deviceId: action.payload.deviceIdentity.deviceId,
                },
            },
            type: NotificationType.success
          });

        yield put(updateDeviceIdentityAction.done({params: action.payload, result: deviceIdentity}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceOnError,
                translationOptions: {
                    deviceId: action.payload.deviceIdentity.deviceId,
                    error,
                },
            },
            type: NotificationType.error
          });

        yield put(updateDeviceIdentityAction.failed({params: action.payload, error}));
    }
}

export function* DeviceIdentitySaga(): SagaIterator {
    yield all([
        takeLatest(getDeviceIdentityAction.started.type, getDeviceIdentitySagaWorker),
        takeEvery(updateDeviceIdentityAction.started.type, updateDeviceIdentitySagaWorker),
    ]);
}
