/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { invokeDigitalTwinInterfaceCommandAction, InvokeDigitalTwinInterfaceCommandActionParameters } from '../actions';
import { invokeDigitalTwinInterfaceCommand } from '../../../api/services/digitalTwinService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../constants/devices';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { getSchemaValidationErrors } from '../../../shared/utils/jsonSchemaAdaptor';

// tslint:disable-next-line: cyclomatic-complexity
export function* invokeDigitalTwinInterfaceCommandSaga(action: Action<InvokeDigitalTwinInterfaceCommandActionParameters>) {
    const toastId: number = Math.random();
    const { componentName, commandName, digitalTwinId, commandPayload } = action.payload;

    try {
        yield call(notifyMethodInvoked, toastId, action);
        const response = yield call(invokeDigitalTwinInterfaceCommand, {
            commandName,
            componentName,
            digitalTwinId,
            payload: commandPayload
        });
        const responseStringified = JSON.stringify(response);

        const validationResult = getValidationResult(response, action.payload.responseSchema);
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ?
                    (validationResult ?
                        ResourceKeys.notifications.invokeDigitalTwinCommandOnDefaultComponentOnSuccessButResponseIsNotValid :
                        ResourceKeys.notifications.invokeDigitalTwinCommandOnDefaultComponentOnSuccess) :
                    (validationResult ? ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccessButResponseIsNotValid :
                        ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccess),
                translationOptions: {
                    commandName,
                    componentName,
                    deviceId: digitalTwinId,
                    response: responseStringified,
                    validationResult
                },
            },
            type: validationResult ? NotificationType.warning : NotificationType.success
        });

        yield put(invokeDigitalTwinInterfaceCommandAction.done({params: action.payload, result: response}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey: componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ?
                    ResourceKeys.notifications.invokeDigitalTwinCommandOnDefaultComponentOnError : ResourceKeys.notifications.invokeDigitalTwinCommandOnError,
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
        const translationKey = componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ?
                (commandPayload ? ResourceKeys.notifications.invokingDigitalTwinCommandWithPayloadOnDefaultComponent : ResourceKeys.notifications.invokingDigitalTwinCommandOnDefaultComponent) :
                (commandPayload ? ResourceKeys.notifications.invokingDigitalTwinCommandWithPayload : ResourceKeys.notifications.invokingDigitalTwinCommand);
        yield call(raiseNotificationToast, {
            id: toastId,
            text: {
                translationKey,
                translationOptions: {
                    commandName,
                    componentName,
                    deviceId: digitalTwinId,
                    payload: JSON.stringify(commandPayload),
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
