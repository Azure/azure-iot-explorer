/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeDigitalTwinInterfaceCommandAction, InvokeDigitalTwinInterfaceCommandActionParameters } from '../actions';
import { invokeDigitalTwinInterfaceCommand } from '../../../api/services/digitalTwinService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getComponentNameSelector } from '../selectors';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';

export function* invokeDigitalTwinInterfaceCommandSaga(action: Action<InvokeDigitalTwinInterfaceCommandActionParameters>) {
    const toastId: number = Math.random();

    const componentName = yield select(getComponentNameSelector);
    try {
        const payload = yield call(notifyMethodInvoked, toastId, action);
        const response = yield call(invokeDigitalTwinInterfaceCommand, {
            commandName: action.payload.commandName,
            componentName,
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            digitalTwinId: action.payload.digitalTwinId,
            payload
        });
        const responseStringified = JSON.stringify(response);

        yield put(addNotificationAction.started({
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
        }));

        yield put(invokeDigitalTwinInterfaceCommandAction.done({params: action.payload, result: response}));
    } catch (error) {
        yield put(addNotificationAction.started({
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
        }));

        yield put(invokeDigitalTwinInterfaceCommandAction.failed({params: action.payload, error}));
    }
}

// tslint:disable-next-line: no-any
export const generateCommandPayload = (commandPayload: any) => {
    return commandPayload || null;
};

export function* notifyMethodInvoked(toastId: number, action: Action<InvokeDigitalTwinInterfaceCommandActionParameters>) {
    if (action.payload) {
        const commandPayload = generateCommandPayload(action.payload.commandPayload);
        yield put(addNotificationAction.started({
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
        }));
        return commandPayload;
    }
}
