/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeEvery, all } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeDirectMethodAction, InvokeMethodActionParameters } from './actions';
import { invokeDirectMethod } from '../../api/services/devicesService';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { InvokeMethodParameters } from '../../api/parameters/deviceParameters';
import { loggerSaga } from '../../shared/appTelemetry/appTelemetrySaga';

export function* invokeDirectMethodSagaWorker(action: Action<InvokeMethodActionParameters>) {
    const toastId: number = Math.random();

    try {
        const invokeMethodParameters: InvokeMethodParameters = {
            ...action.payload,
        };

        yield call(notifyMethodInvokedHelper, toastId, invokeMethodParameters);

        const response = yield call(invokeDirectMethod, invokeMethodParameters);
        const stringifiedResponse = typeof response === 'object' ? JSON.stringify(response) : response;

        yield call(raiseNotificationToast, {
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
        });

        yield put(invokeDirectMethodAction.done({params: action.payload, result: stringifiedResponse}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeMethodOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error
        });

        yield put(invokeDirectMethodAction.failed({params: action.payload, error}));
    }
}

export function* notifyMethodInvokedHelper(toastId: number, payload: InvokeMethodParameters) {
    if (payload) {
        if ( payload.payload !== undefined) { // payload could be boolean value false
            yield call(raiseNotificationToast, {
                id: toastId,
                text: {
                    translationKey: ResourceKeys.notifications.invokingMethodWithPayload,
                    translationOptions: {
                        deviceId: payload.deviceId,
                        methodName: payload.methodName,
                        payload: JSON.stringify(payload.payload),
                    },
                },
                type: NotificationType.info
            });
            return payload.payload;
        }
        else
        {
            yield call(raiseNotificationToast, {
                id: toastId,
                text: {
                    translationKey: ResourceKeys.notifications.invokingMethod,
                    translationOptions: {
                        deviceId: payload.deviceId,
                        methodName: payload.methodName,
                    },
                },
                type: NotificationType.info,
            });

            return;
        }
    }
}

export function* invokeDirectMethodSaga() {
    yield all([
        takeEvery(invokeDirectMethodAction.started.type, invokeDirectMethodSagaWorker),
        takeEvery('*', loggerSaga)
    ]);
}
