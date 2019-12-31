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
import { deleteDevicesAction } from '../actions';
import { deleteDevices } from '../../../api/services/devicesService';

export function* deleteDevicesSaga(action: Action<string[]>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            deviceIds: action.payload,
        };

        const bulkDeleteResult = yield call(deleteDevices, parameters);
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.deleteDeviceOnSucceed,
                translationOptions: {
                    count: action.payload.length
                },
            },
            type: NotificationType.success
          }));
        yield put(deleteDevicesAction.done({params: action.payload, result: bulkDeleteResult}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.deleteDeviceOnError,
                translationOptions: {
                    count: action.payload.length,
                    error,
                },
            },
            type: NotificationType.error
          }));

        yield put(deleteDevicesAction.failed({params: action.payload, error}));
    }
}
