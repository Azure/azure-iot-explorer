/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { cloudToDeviceMessageAction } from './actions';
import { cloudToDeviceMessage } from '../../api/services/devicesService';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CloudToDeviceMessageParameters } from '../../api/parameters/deviceParameters';

export function* cloudToDeviceMessageSagaWorker(action: Action<CloudToDeviceMessageParameters>): SagaIterator {
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

        const cloudToDeviceMessageParameters: CloudToDeviceMessageParameters = {
            ...action.payload
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

export function* cloudToDeviceMessageSaga(): SagaIterator {
    yield takeEvery(cloudToDeviceMessageAction.started.type, cloudToDeviceMessageSagaWorker);
}
