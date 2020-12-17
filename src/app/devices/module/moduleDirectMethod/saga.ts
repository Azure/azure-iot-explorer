/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeModuleDirectMethodAction, InvokeModuleMethodActionParameters } from './actions';
import { invokeModuleDirectMethod } from '../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { InvokeModuleMethodParameters } from '../../../api/parameters/moduleParameters';

export function* invokeModuleDirectMethodSagaWorker(action: Action<InvokeModuleMethodActionParameters>) {
    const toastId: number = Math.random();

    try {
        const invokeMethodParameters: InvokeModuleMethodParameters = {
            ...action.payload,
        };

        yield call(notifyModuleMethodInvokedHelper, toastId, invokeMethodParameters);

        const response = yield call(invokeModuleDirectMethod, invokeMethodParameters);
        const stringifiedResponse = typeof response === 'object' ? JSON.stringify(response) : response;

        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeModuleMethodOnSuccess,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    methodName: action.payload.methodName,
                    moduleId: action.payload.moduleId,
                    response: stringifiedResponse
                },
            },
            type: NotificationType.success
        });

        yield put(invokeModuleDirectMethodAction.done({params: action.payload, result: stringifiedResponse}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeModuleMethodOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
                    error,
                    moduleId: action.payload.moduleId
                },
            },
            type: NotificationType.error
        });

        yield put(invokeModuleDirectMethodAction.failed({params: action.payload, error}));
    }
}

export function* notifyModuleMethodInvokedHelper(toastId: number, payload: InvokeModuleMethodParameters) {
    if (payload) {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokingModuleMethodWithPayload,
                translationOptions: {
                    deviceId: payload.deviceId,
                    methodName: payload.methodName,
                    moduleId: payload.moduleId,
                    payload: JSON.stringify(payload.payload),
                },
            },
            type: NotificationType.info
        });
        return payload.payload;
    }
}

export function* invokeModuleDirectMethodSaga() {
    yield takeEvery(invokeModuleDirectMethodAction.started.type, invokeModuleDirectMethodSagaWorker);
}
