/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { cloudToDeviceMessageAction } from '../actions';
import { cloudToDeviceMessage } from '../../../api/services/devicesService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import {  CloudToDeviceMessageParameters } from '../../../api/parameters/deviceParameters';

export function* cloudToDeviceMessageSaga(action: Action<CloudToDeviceMessageParameters>) {
    const toastId: number = Math.random();

    try {
        yield put(addNotificationAction.started({
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.sendingCloudToDeviceMessage,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    message: action.payload.body
                },
            },
            type: NotificationType.info,
        }));
        const response = yield call(cloudToDeviceMessage, {
            ...action.payload
        });

        yield put(addNotificationAction.started({
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.cloudToDeviceMessageOnSuccess,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    message: action.payload.body
                },
            },
            type: NotificationType.success
        }));

        yield put(cloudToDeviceMessageAction.done({params: action.payload, result: response}));
    } catch (error) {
        yield put(addNotificationAction.started({
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.cloudToDeviceMessageOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
        }));

        yield put(cloudToDeviceMessageAction.failed({params: action.payload, error}));
    }
}
