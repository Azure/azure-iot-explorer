/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { select, call, put } from 'redux-saga/effects';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { invokeDigitalTwinInterfaceCommandSaga, notifyMethodInvoked } from './digitalTwinInterfaceCommandSaga';
import { invokeDigitalTwinInterfaceCommandAction, InvokeDigitalTwinInterfaceCommandActionParameters } from '../actions';
import * as DevicesService from '../../../api/services/devicesService';
import { getInterfaceNameSelector } from '../selectors';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { addNotificationAction } from '../../../notifications/actions';

describe('digitalTwinInterfaceCommandSaga', () => {
    let invokeDigitalTwinInterfaceCommandSagaGenerator: SagaIteratorClone;
    let notifyMethodInvokedGenerator: SagaIteratorClone;
    let notifyMethodInvokedGeneratorNoPayload: SagaIteratorClone;

    const connectionString = 'connection_string';
    const digitalTwinId = 'device_id';
    const commandName = 'command';
    const interfaceName = 'interface_name';
    const payload = { };

    const randomNumber = 0;

    const mockRandom = jest.spyOn(Math, 'random').mockImplementation(() => {
        return randomNumber;
    });

    const response = JSON.stringify({
        commandName,
        result: true
    });

    const invokeParameters: InvokeDigitalTwinInterfaceCommandActionParameters = {
        commandName,
        commandPayload: payload,
        digitalTwinId
    };

    describe('invokeDigitalTwinInterfaceCommandSaga', () => {
        beforeAll(() => {
            invokeDigitalTwinInterfaceCommandSagaGenerator = cloneableGenerator(invokeDigitalTwinInterfaceCommandSaga)(invokeDigitalTwinInterfaceCommandAction.started(invokeParameters));
        });

        const mockInvokeDigitalTwinInterfaceCommand = jest.spyOn(DevicesService, 'invokeDigitalTwinInterfaceCommand').mockImplementationOnce(parameters => {
            return null;
        });

        it('fetches the interface name', () => {
            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next()).toEqual({
                done: false,
                value: select(getInterfaceNameSelector)
            });
        });

        it('notifies of method invokation', () => {
            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next(interfaceName)).toEqual({
                done: false,
                value: call(notifyMethodInvoked, randomNumber, invokeDigitalTwinInterfaceCommandAction.started(invokeParameters))
            });
        });

        it('invokes the command', () => {
            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next(payload)).toEqual({
                done: false,
                value: call(getActiveAzureResourceConnectionStringSaga)
            });

            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockInvokeDigitalTwinInterfaceCommand, {
                    commandName,
                    connectionString,
                    digitalTwinId,
                    interfaceName,
                    payload
                })
            });
        });

        it('puts the successful action', () => {
            const success = invokeDigitalTwinInterfaceCommandSagaGenerator.clone();
            expect(success.next(response)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                        id: randomNumber,
                        text: {
                            translationKey: ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccess,
                            translationOptions: {
                                commandName,
                                deviceId: digitalTwinId,
                                interfaceName,
                                response: JSON.stringify(response)
                            },
                        },
                        type: NotificationType.success
                    }))
            });
            expect(success.next()).toEqual({
                done: false,
                value: put(invokeDigitalTwinInterfaceCommandAction.done({
                    params: invokeParameters,
                    result: response
                }))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = invokeDigitalTwinInterfaceCommandSagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokeDigitalTwinCommandOnError,
                        translationOptions: {
                            commandName,
                            deviceId: digitalTwinId,
                            error,
                            interfaceName
                        },
                    },
                    type: NotificationType.error,
                  }))
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(invokeDigitalTwinInterfaceCommandAction.failed({
                    error,
                    params: invokeParameters
                }))
            });
            expect(failure.next().done).toEqual(true);
        });
    });

    describe('notifyMethodInvoked', () => {
        beforeAll(() => {
            notifyMethodInvokedGenerator = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeDigitalTwinInterfaceCommandAction.started(invokeParameters));
            notifyMethodInvokedGeneratorNoPayload = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeDigitalTwinInterfaceCommandAction.started(null));
        });

        it('puts a notification if there is a payload', () => {
            expect(notifyMethodInvokedGenerator.next()).toEqual({
                done: false,
                value: select(getInterfaceNameSelector)
            });

            expect(notifyMethodInvokedGenerator.next(interfaceName)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokingDigitalTwinCommandWithPayload,
                        translationOptions: {
                            commandName,
                            deviceId: digitalTwinId,
                            interfaceName,
                            payload: JSON.stringify(payload),
                        },
                    },
                    type: NotificationType.info,
                }))
            });

            expect(notifyMethodInvokedGenerator.next().done).toEqual(true);
        });

        it('does nothing if no payload', () => {
            expect(notifyMethodInvokedGeneratorNoPayload.next().done).toEqual(true);
        });
    });
});
