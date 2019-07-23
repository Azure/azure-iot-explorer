/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchDevice, updateDevice } from '../../../api/services/devicesService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getConnectionStringSelector } from '../../../login/selectors';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from '../actions';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';

export function* getDeviceIdentitySaga(action: Action<string>) {
    try {
        const parameters = {
            connectionString: yield select(getConnectionStringSelector),
            deviceId: action.payload,
        };

        const devieIdentity = yield call(fetchDevice, parameters);
        yield put(getDeviceIdentityAction.done({params: action.payload, result: devieIdentity}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.getDeviceIdentityOnError,
                translationOptions: {
                    deviceId: action.payload,
                    error,
                },
            },
            type: NotificationType.error
        }));

        yield put(getDeviceIdentityAction.failed({params: action.payload, error}));
    }
}

export function* updateDeviceIdentitySaga(action: Action<DeviceIdentity>) {
    try {
        const parameters = {
            connectionString: yield select(getConnectionStringSelector),
            deviceIdentity: action.payload,
        };

        const devieIdentity = yield call(updateDevice, parameters);
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceOnSucceed,
                translationOptions: {
                   deviceId: action.payload.deviceId,
                },
            },
            type: NotificationType.success
          }));
        yield put(updateDeviceIdentityAction.done({params: action.payload, result: devieIdentity}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
          }));

        yield put(updateDeviceIdentityAction.failed({params: action.payload, error}));
    }
}
