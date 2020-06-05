/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeDigitalTwinInterfaceCommandAction, InvokeDigitalTwinInterfaceCommandActionParameters } from '../actions';
import { invokeDigitalTwinInterfaceCommand } from '../../../../api/services/digitalTwinService';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { NotificationType } from '../../../../api/models/notification';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getComponentNameSelector } from '../../selectors';

export function* invokeDigitalTwinInterfaceCommandSaga(action: Action<InvokeDigitalTwinInterfaceCommandActionParameters>) {
    const toastId: number = Math.random();

    const componentName = yield select(getComponentNameSelector);
    try {
        const payload = yield call(notifyMethodInvoked, toastId, action);
        const response = yield call(invokeDigitalTwinInterfaceCommand, {
            commandName: action.payload.commandName,
            componentName,
            digitalTwinId: action.payload.digitalTwinId,
            payload
        });
        const responseStringified = JSON.stringify(response);

        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccess,
                translationOptions: {
                    commandName: action.payload.commandName,
                    componentName,
                    deviceId: action.payload.digitalTwinId,
                    response: responseStringified
                },
            },
            type: NotificationType.success
        });

        yield put(invokeDigitalTwinInterfaceCommandAction.done({params: action.payload, result: response}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeDigitalTwinCommandOnError,
                translationOptions: {
                    commandName: action.payload.commandName,
                    componentName,
                    deviceId: action.payload.digitalTwinId,
                    error,
                },
            },
            type: NotificationType.error,
        });

        yield put(invokeDigitalTwinInterfaceCommandAction.failed({params: action.payload, error}));
    }
}

export function* notifyMethodInvoked(toastId: number, action: Action<InvokeDigitalTwinInterfaceCommandActionParameters>) {
    if (action.payload) {
        const commandPayload = action.payload.commandPayload;
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokingDigitalTwinCommandWithPayload,
                translationOptions: {
                    commandName: action.payload.commandName,
                    componentName: yield select(getComponentNameSelector),
                    deviceId: action.payload.digitalTwinId,
                    payload: JSON.stringify(commandPayload),
                },
            },
            type: NotificationType.info,
        });

        return commandPayload;
    }
}
