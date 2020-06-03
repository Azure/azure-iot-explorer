/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchDeviceTwin, updateDeviceTwin } from '../../../api/services/devicesService';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { getTwinAction, UpdateTwinActionParameters, updateTwinAction } from '../actions';
import { UpdateDeviceTwinParameters } from '../../../api/parameters/deviceParameters';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

export function* getDeviceTwinSaga(action: Action<string>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            deviceId: action.payload,
        };

        const twin = yield call(fetchDeviceTwin, parameters);

        yield put(getTwinAction.done({params: action.payload, result: twin}));
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

        yield put(getTwinAction.failed({params: action.payload, error}));
    }
}

export function* updateDeviceTwinSaga(action: Action<UpdateTwinActionParameters>) {
    try {
        const parameters: UpdateDeviceTwinParameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            deviceId: action.payload.deviceId,
            deviceTwin: action.payload.twin,
        };

        const twin = yield call(updateDeviceTwin, parameters);

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateDeviceTwinOnSuccess,
                translationOptions: {
                    deviceId: action.payload.deviceId
                },
            },
            type: NotificationType.success
          });

        yield put(updateTwinAction.done({params: action.payload, result: twin}));
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

        yield put(updateTwinAction.failed({params: action.payload, error}));
    }
}
