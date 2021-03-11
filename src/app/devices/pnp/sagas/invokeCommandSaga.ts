/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeCommandAction, InvokeCommandActionParameters } from '../actions';
import { invokeDirectMethod } from '../../../api/services/devicesService';
import { invokeModuleDirectMethod } from '../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { getSchemaValidationErrors } from '../../../shared/utils/jsonSchemaAdaptor';

export function* invokeCommandSaga(action: Action<InvokeCommandActionParameters>) {
    const toastId: number = Math.random();

    try {
        yield call(notifyMethodInvoked, toastId, action);
        const response = action.payload.moduleId ? yield call(invokeModuleDirectMethod, action.payload) :
            yield call(invokeDirectMethod, action.payload);
        const responseStringified = JSON.stringify(response);

        const validationResult = getValidationResult(response, action.payload.responseSchema);
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: validationResult ? ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccessButResponseIsNotValid :
                    ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccess,
                translationOptions: {
                    commandName: action.payload.methodName,
                    deviceId: action.payload.deviceId,
                    response: responseStringified,
                    validationResult
                },
            },
            type: validationResult ? NotificationType.warning : NotificationType.success
        });

        yield put(invokeCommandAction.done({params: action.payload, result: response}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeDigitalTwinCommandOnError,
                translationOptions: {
                    commandName: action.payload.methodName,
                    deviceId: action.payload.deviceId,
                    error,
                },
            },
            type: NotificationType.error,
        });

        yield put(invokeCommandAction.failed({params: action.payload, error}));
    }
}

export function* notifyMethodInvoked(toastId: number, action: Action<InvokeCommandActionParameters>) {
    if (action.payload) {
        const translationKey = action.payload.payload ?
            ResourceKeys.notifications.invokingDigitalTwinCommandWithPayload : ResourceKeys.notifications.invokingDigitalTwinCommand;
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey,
                translationOptions: {
                    commandName: action.payload.methodName,
                    deviceId: action.payload.deviceId,
                    payload: JSON.stringify(action.payload.payload),
                },
            },
            type: NotificationType.info,
        });
    }
}

const getValidationResult = (response: any, schema: ParsedJsonSchema) => { // tslint:disable-line:no-any
    const errors = getSchemaValidationErrors(response, schema, true);
    return errors.length !== 0 && errors.map(element => element.message).join(', ');
};
