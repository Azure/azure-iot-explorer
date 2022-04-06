/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { deleteDevicesAction } from '../actions';
import { deleteDevices } from '../../../api/services/devicesService';

export function* deleteDevicesSaga(action: Action<string[]>): SagaIterator {
    try {
        const parameters = {
            deviceIds: action.payload,
        };

        const bulkDeleteResult = yield call(deleteDevices, parameters);
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.deleteDeviceOnSucceed,
                translationOptions: {
                    count: action.payload.length
                },
            },
            type: NotificationType.success
          });

        yield put(deleteDevicesAction.done({params: action.payload, result: bulkDeleteResult}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.deleteDeviceOnError,
                translationOptions: {
                    count: action.payload.length,
                    error,
                },
            },
            type: NotificationType.error
          });

        yield put(deleteDevicesAction.failed({params: action.payload, error}));
    }
}
