/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { invokeDigitalTwinInterfaceCommandSaga, notifyMethodInvoked } from './digitalTwinInterfaceCommandSaga';
import { invokeDigitalTwinInterfaceCommandAction, InvokeDigitalTwinInterfaceCommandActionParameters } from '../actions';
import * as DigitalTwinService from '../../../api/services/digitalTwinService';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../constants/devices';

describe('digitalTwinInterfaceCommandSaga', () => {
    let invokeDigitalTwinInterfaceCommandSagaGenerator: SagaIteratorClone;
    let notifyMethodInvokedGeneratorWithPaylaod: SagaIteratorClone;
    let notifyMethodInvokedGenerator: SagaIteratorClone;
    let notifyMethodInvokedGeneratorOndDefaultComponent: SagaIteratorClone;

    const digitalTwinId = 'device_id';
    const commandName = 'command';
    const componentName = 'interface_name';
    const payload = {};

    const randomNumber = 0;

    jest.spyOn(Math, 'random').mockImplementation(() => {
        return randomNumber;
    });

    const response = JSON.stringify({
        commandName,
        result: true
    });

    const invokeParameters: InvokeDigitalTwinInterfaceCommandActionParameters = {
        commandName,
        commandPayload: payload,
        componentName,
        digitalTwinId,
        responseSchema: undefined
    };

    describe('invokeDigitalTwinInterfaceCommandSaga', () => {
        beforeAll(() => {
            invokeDigitalTwinInterfaceCommandSagaGenerator = cloneableGenerator(invokeDigitalTwinInterfaceCommandSaga)(invokeDigitalTwinInterfaceCommandAction.started(invokeParameters));
        });

        const mockInvokeDigitalTwinInterfaceCommand = jest.spyOn(DigitalTwinService, 'invokeDigitalTwinInterfaceCommand').mockImplementationOnce(parameters => {
            return null;
        });

        it('notifies of method invokation', () => {
            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next()).toEqual({
                done: false,
                value: call(notifyMethodInvoked, randomNumber, invokeDigitalTwinInterfaceCommandAction.started(invokeParameters))
            });
        });

        it('invokes the command', () => {
            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next(payload)).toEqual({
                done: false,
                value: call(mockInvokeDigitalTwinInterfaceCommand, {
                    commandName,
                    componentName,
                    digitalTwinId,
                    payload
                })
            });
        });

        it('puts the successful action', () => {
            const success = invokeDigitalTwinInterfaceCommandSagaGenerator.clone();
            expect(success.next(response)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                        id: randomNumber,
                        text: {
                            translationKey: ResourceKeys.notifications.invokeDigitalTwinCommandOnSuccess,
                            translationOptions: {
                                commandName,
                                componentName,
                                deviceId: digitalTwinId,
                                response: JSON.stringify(response),
                                validationResult: false
                            },
                        },
                        type: NotificationType.success
                    })
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
                value: call(raiseNotificationToast, {
                    id: randomNumber,
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
                  })
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
            notifyMethodInvokedGeneratorWithPaylaod = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeDigitalTwinInterfaceCommandAction.started(invokeParameters));
            notifyMethodInvokedGenerator = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeDigitalTwinInterfaceCommandAction.started({
                ...invokeParameters,
                commandPayload: null
            }));
            notifyMethodInvokedGeneratorOndDefaultComponent =  cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeDigitalTwinInterfaceCommandAction.started({
                ...invokeParameters,
                commandPayload: null,
                componentName: DEFAULT_COMPONENT_FOR_DIGITAL_TWIN
            }));
        });

        it('puts a notification with payload if there is a payload', () => {
            expect(notifyMethodInvokedGeneratorWithPaylaod.next(componentName)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokingDigitalTwinCommandWithPayload,
                        translationOptions: {
                            commandName,
                            componentName,
                            deviceId: digitalTwinId,
                            payload: JSON.stringify(payload),
                        },
                    },
                    type: NotificationType.info,
                })
            });

            expect(notifyMethodInvokedGeneratorWithPaylaod.next().done).toEqual(true);
        });

        it('puts a notification with no payload if there is no payload', () => {
            expect(notifyMethodInvokedGenerator.next(componentName)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokingDigitalTwinCommand,
                        translationOptions: {
                            commandName,
                            componentName,
                            deviceId: digitalTwinId,
                            payload: 'null'
                        },
                    },
                    type: NotificationType.info,
                })
            });

            expect(notifyMethodInvokedGenerator.next().done).toEqual(true);
        });

        it('puts a notification with no payload on default component', () => {
            expect(notifyMethodInvokedGeneratorOndDefaultComponent.next(componentName)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokingDigitalTwinCommandOnDefaultComponent,
                        translationOptions: {
                            commandName,
                            componentName: DEFAULT_COMPONENT_FOR_DIGITAL_TWIN,
                            deviceId: digitalTwinId,
                            payload: 'null'
                        },
                    },
                    type: NotificationType.info,
                })
            });

            expect(notifyMethodInvokedGeneratorOndDefaultComponent.next().done).toEqual(true);
        });
    });
});
