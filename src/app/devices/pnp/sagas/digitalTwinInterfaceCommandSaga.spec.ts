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

describe('digitalTwinInterfaceCommandSaga', () => {
    let invokeDigitalTwinInterfaceCommandSagaGenerator: SagaIteratorClone;
    let notifyMethodInvokedGenerator: SagaIteratorClone;
    let notifyMethodInvokedGeneratorNoPayload: SagaIteratorClone;

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
        digitalTwinId
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
                                response: JSON.stringify(response)
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
            notifyMethodInvokedGenerator = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeDigitalTwinInterfaceCommandAction.started(invokeParameters));
            notifyMethodInvokedGeneratorNoPayload = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeDigitalTwinInterfaceCommandAction.started(null));
        });

        it('puts a notification if there is a payload', () => {
            expect(notifyMethodInvokedGenerator.next(componentName)).toEqual({
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

            expect(notifyMethodInvokedGenerator.next().done).toEqual(true);
        });

        it('does nothing if no payload', () => {
            expect(notifyMethodInvokedGeneratorNoPayload.next().done).toEqual(true);
        });
    });
});
