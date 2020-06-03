/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { cloudToDeviceMessageAction, CloudToDeviceMessageActionParameters } from '../actions';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { cloudToDeviceMessage } from '../../../api/services/devicesService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { CloudToDeviceMessageParameters } from '../../../api/parameters/deviceParameters';

export function* cloudToDeviceMessageSaga(action: Action<CloudToDeviceMessageActionParameters>) {
    const toastId: number = Math.random();

    try {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.sendingCloudToDeviceMessage,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    message: action.payload.body
                },
            },
            type: NotificationType.info,
        });

        const connectionString: string = yield call(getActiveAzureResourceConnectionStringSaga);
        const cloudToDeviceMessageParameters: CloudToDeviceMessageParameters = {
            ...action.payload,
            connectionString
        };

        const response = yield call(cloudToDeviceMessage, cloudToDeviceMessageParameters);

        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.cloudToDeviceMessageOnSuccess,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    message: action.payload.body
                },
            },
            type: NotificationType.success
        });

        yield put(cloudToDeviceMessageAction.done({params: action.payload, result: response}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.cloudToDeviceMessageOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
        });

        yield put(cloudToDeviceMessageAction.failed({params: action.payload, error}));
    }
}
