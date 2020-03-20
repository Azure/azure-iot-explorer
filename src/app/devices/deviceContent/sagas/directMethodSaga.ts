/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeDirectMethodAction, InvokeMethodActionParameters } from '../actions';
import { invokeDirectMethod } from '../../../api/services/devicesService';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { InvokeMethodParameters } from '../../../api/parameters/deviceParameters';

export function* invokeDirectMethodSaga(action: Action<InvokeMethodActionParameters>) {
    const toastId: number = Math.random();

    try {
        const payload = yield call(notifyMethodInvoked, toastId, action);

        const connectionString: string = yield call(getActiveAzureResourceConnectionStringSaga);
        const invokeMethodParameters: InvokeMethodParameters = {
            ...action.payload,
            connectionString
        };

        const response = yield call(invokeDirectMethod, invokeMethodParameters);
        const stringifiedResponse = typeof response === 'object' ? JSON.stringify(response) : response;

        yield put(addNotificationAction.started({
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeMethodOnSuccess,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    methodName: action.payload.methodName,
                    response: stringifiedResponse
                },
            },
            type: NotificationType.success
        }));

        yield put(invokeDirectMethodAction.done({params: action.payload, result: stringifiedResponse}));
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

        yield put(invokeDirectMethodAction.failed({params: action.payload, error}));
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
