/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, all, takeLatest, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchDevice, updateDevice } from '../../../api/services/devicesService';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from './actions';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

export function* getDeviceIdentitySagaWorker(action: Action<string>) {
    try {
        const parameters = {
            deviceId: action.payload,
        };

        const devieIdentity = yield call(fetchDevice, parameters);
        yield put(getDeviceIdentityAction.done({params: action.payload, result: devieIdentity}));
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

export function* updateDeviceIdentitySagaWorker(action: Action<DeviceIdentity>) {
    try {
        const parameters = {
            deviceIdentity: action.payload,
        };

        const devieIdentity = yield call(updateDevice, parameters);
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceOnSucceed,
                translationOptions: {
                   deviceId: action.payload.deviceId,
                },
            },
            type: NotificationType.success
          });

        yield put(updateDeviceIdentityAction.done({params: action.payload, result: devieIdentity}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
          });

        yield put(updateDeviceIdentityAction.failed({params: action.payload, error}));
    }
}

export function* DeviceIdentitySaga() {
    yield all([
        takeLatest(getDeviceIdentityAction.started.type, getDeviceIdentitySagaWorker),
        takeEvery(updateDeviceIdentityAction.started.type, updateDeviceIdentitySagaWorker),
    ]);
}
