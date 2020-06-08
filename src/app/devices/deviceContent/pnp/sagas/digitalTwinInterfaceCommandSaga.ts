/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeDigitalTwinInterfaceCommandAction, InvokeDigitalTwinInterfaceCommandActionParameters } from '../actions';
import { invokeDigitalTwinInterfaceCommand } from '../../../../api/services/digitalTwinService';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { NotificationType } from '../../../../api/models/notification';
import { ResourceKeys } from '../../../../../localization/resourceKeys';

export function* invokeDigitalTwinInterfaceCommandSaga(action: Action<InvokeDigitalTwinInterfaceCommandActionParameters>) {
    const toastId: number = Math.random();
    const { componentName, commandName, digitalTwinId } = action.payload;

    try {
        const payload = yield call(notifyMethodInvoked, toastId, action);
        const response = yield call(invokeDigitalTwinInterfaceCommand, {
            commandName,
            componentName,
            digitalTwinId,
            payload
        });
        const responseStringified = JSON.stringify(response);

        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccess,
                translationOptions: {
                    commandName,
                    componentName,
                    deviceId: digitalTwinId,
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
                    commandName,
                    componentName,
                    deviceId: digitalTwinId,
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
        const { commandPayload, componentName, commandName, digitalTwinId } = action.payload;
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: ResourceKeys.notifications.invokingDigitalTwinCommandWithPayload,
                translationOptions: {
                    commandName,
                    componentName,
                    deviceId: digitalTwinId,
                    payload: JSON.stringify(commandPayload),
                },
            },
            type: NotificationType.info,
        });

        return commandPayload;
    }
}
