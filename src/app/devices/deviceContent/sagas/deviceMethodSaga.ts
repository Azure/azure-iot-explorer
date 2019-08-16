/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeDeviceMethodAction } from '../actions';
import { invokeDeviceMethod } from '../../../api/services/devicesService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { InvokeMethodParameters } from '../../../api/parameters/deviceParameters';

export function* invokeDeviceMethodSaga(action: Action<InvokeMethodParameters>) {
    const toastId: number = Math.random();

    try {
        const payload = yield call(notifyMethodInvoked, toastId, action);
        const response = yield call(invokeDeviceMethod, {
            connectTimeoutInSeconds: action.payload.connectTimeoutInSeconds,
            connectionString: action.payload.connectionString,
            deviceId: action.payload.deviceId,
            methodName: action.payload.methodName,
            payload,
            responseTimeoutInSeconds: action.payload.responseTimeoutInSeconds
        });

        yield put(addNotificationAction.started({
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeMethodOnSuccess,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    methodName: action.payload.methodName,
                    response
                },
            },
            type: NotificationType.success
        }));

        yield put(invokeDeviceMethodAction.done({params: action.payload, result: response}));
    } catch (error) {
        yield put(addNotificationAction.started({
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeMethodOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
        }));

        yield put(invokeDeviceMethodAction.failed({params: action.payload, error}));
    }
}

export function* notifyMethodInvoked(toastId: number, action: Action<InvokeMethodParameters>) {
    if (action.payload) {
        if ( action.payload.payload !== undefined) { // payload could be boolean value false
            yield put(addNotificationAction.started({
                id: toastId,
                text: {
                    translationKey: ResourceKeys.notifications.invokingMethodWithPayload,
                    translationOptions: {
                        deviceId: action.payload.deviceId,
                        methodName: action.payload.methodName,
                        payload: JSON.stringify(action.payload.payload),
                    },
                },
                type: NotificationType.info
            }));
            return action.payload.payload;
        }
        else
        {
            yield put(addNotificationAction.started({
                id: toastId,
                text: {
                    translationKey: ResourceKeys.notifications.invokingMethod,
                    translationOptions: {
                        deviceId: action.payload.deviceId,
                        methodName: action.payload.methodName,
                    },
                },
                type: NotificationType.info,
            }));

            return;
        }
    }
}
