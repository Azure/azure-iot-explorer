/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { addDeviceAction } from '../actions';
import { addDevice } from '../../../api/services/devicesService';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';

export function* addDeviceSaga(action: Action<DeviceIdentity>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            deviceIdentity: action.payload,
        };

        const result = yield call(addDevice, parameters);

        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.addDeviceOnSucceed,
                translationOptions: {
                    deviceId: action.payload.deviceId
                },
            },
            type: NotificationType.success
        }));

        yield put(addDeviceAction.done({params: action.payload, result}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.addDeviceOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
          }));

        yield put(addDeviceAction.failed({params: action.payload, error}));
    }
}
