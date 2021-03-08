/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { invokeCommandSaga, notifyMethodInvoked } from './invokeCommandSaga';
import { invokeCommandAction, InvokeCommandActionParameters } from '../actions';
import * as DeviceService from '../../../api/services/devicesService';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../../constants/devices';

describe('digitalTwinInterfaceCommandSaga', () => {
    let invokeDigitalTwinInterfaceCommandSagaGenerator: SagaIteratorClone;
    let notifyMethodInvokedGeneratorWithPaylaod: SagaIteratorClone;
    let notifyMethodInvokedGenerator: SagaIteratorClone;

    const deviceId = 'device_id';
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

    const invokeParameters: InvokeCommandActionParameters = {
        connectTimeoutInSeconds: CONNECTION_TIMEOUT_IN_SECONDS,
        methodName: commandName,
        payload: payload,
        deviceId,
        responseTimeoutInSeconds: RESPONSE_TIME_IN_SECONDS,
        responseSchema: undefined
    };

    describe('invokeDigitalTwinInterfaceCommandSaga', () => {
        beforeAll(() => {
            invokeDigitalTwinInterfaceCommandSagaGenerator = cloneableGenerator(invokeCommandSaga)(invokeCommandAction.started(invokeParameters));
        });

        const mockInvokeCommand = jest.spyOn(DeviceService, 'invokeDirectMethod').mockImplementationOnce(parameters => {
            return null;
        });

        it('notifies of method invokation', () => {
            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next()).toEqual({
                done: false,
                value: call(notifyMethodInvoked, randomNumber, invokeCommandAction.started(invokeParameters))
            });
        });

        it('invokes the command', () => {
            expect(invokeDigitalTwinInterfaceCommandSagaGenerator.next(payload)).toEqual({
                done: false,
                value: call(mockInvokeCommand, invokeParameters)
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
                                deviceId,
                                response: JSON.stringify(response),
                                validationResult: false
                            },
                        },
                        type: NotificationType.success
                    })
            });
            expect(success.next()).toEqual({
                done: false,
                value: put(invokeCommandAction.done({
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
                            deviceId,
                            error,
                        },
                    },
                    type: NotificationType.error,
                  })
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(invokeCommandAction.failed({
                    error,
                    params: invokeParameters
                }))
            });
            expect(failure.next().done).toEqual(true);
        });
    });

    describe('notifyMethodInvoked', () => {
        beforeAll(() => {
            notifyMethodInvokedGeneratorWithPaylaod = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeCommandAction.started(invokeParameters));
            notifyMethodInvokedGenerator = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeCommandAction.started({
                ...invokeParameters,
                payload: null
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
                            deviceId,
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
                            deviceId,
                            payload: 'null'
                        },
                    },
                    type: NotificationType.info,
                })
            });

            expect(notifyMethodInvokedGenerator.next().done).toEqual(true);
        });
    });
});
