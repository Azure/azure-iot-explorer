/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator, SagaIteratorClone } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import * as DevicesService from '../../../api/services/devicesService';
import { invokeDirectMethodSaga, notifyMethodInvoked } from './directMethodSaga';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { invokeDirectMethodAction } from '../actions';
import { InvokeMethodParameters } from '../../../api/parameters/deviceParameters';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('directMethodSaga', () => {
    let invokeDirectMethodSagaGenerator: SagaIteratorClone;
    let notifyMethodInvokedGenerator: SagaIteratorClone;
    let notifyMethodInvokedGeneratorNoPayload: SagaIteratorClone;

    const mockInvokeDirectMethod = jest.spyOn(DevicesService, 'invokeDirectMethod').mockImplementation(parameters => {
        return null;
    });

    const randomNumber = 0;

    jest.spyOn(Math, 'random').mockImplementation(() => {
        return randomNumber;
    });

    const connectionString = 'connection_string';
    const connectTimeoutInSeconds = 10;
    const deviceId = 'device_id';
    const methodName = 'test';
    const payload = {
        body: 'test'
    };
    const responseTimeoutInSeconds = 10;

    const invokeMethodParameters: InvokeMethodParameters = {
        connectTimeoutInSeconds,
        connectionString,
        deviceId,
        methodName,
        payload,
        responseTimeoutInSeconds
    };

    const invokeMethodParametersNoPayload: InvokeMethodParameters = {...invokeMethodParameters};
    invokeMethodParametersNoPayload.payload = undefined;

    beforeAll(() => {
        invokeDirectMethodSagaGenerator = cloneableGenerator(invokeDirectMethodSaga)(invokeDirectMethodAction.started(invokeMethodParameters));
    });

    beforeEach(() => {
        notifyMethodInvokedGenerator = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeMethodParameters);
        notifyMethodInvokedGeneratorNoPayload = cloneableGenerator(notifyMethodInvoked)(randomNumber, invokeMethodParametersNoPayload);
    });

    describe('notifyMethodInvoked', () => {
        it('puts a notification with payload if there is a payload', () => {
            expect(notifyMethodInvokedGenerator.next()).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokingMethodWithPayload,
                        translationOptions: {
                            deviceId,
                            methodName,
                            payload: JSON.stringify(payload),
                        },
                    },
                    type: NotificationType.info
                })
            });

            expect(notifyMethodInvokedGenerator.next().done).toEqual(true);
        });

        it('puts a notification with payload if there is no payload', () => {
            expect(notifyMethodInvokedGeneratorNoPayload.next()).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokingMethod,
                        translationOptions: {
                            deviceId,
                            methodName
                        },
                    },
                    type: NotificationType.info,
                })
            });

            expect(notifyMethodInvokedGeneratorNoPayload.next().done).toEqual(true);
        });
    });

    describe('invokeDirectMethodSaga', () => {

        it('yields call to get active azure connection string', () => {
            expect(invokeDirectMethodSagaGenerator.next(randomNumber)).toEqual({
                done: false,
                value: call(getActiveAzureResourceConnectionStringSaga)
            });
        });

        it('notifies that the method is being invoked', () => {
            expect(invokeDirectMethodSagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(notifyMethodInvoked, randomNumber, invokeMethodParameters)
            });
        });

        it('successfully invokes the method', () => {
            const success = invokeDirectMethodSagaGenerator.clone();

            expect(success.next()).toEqual({
                done: false,
                value: call(mockInvokeDirectMethod, invokeMethodParameters)
            });

            const response = 'hello';

            expect(success.next(response)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokeMethodOnSuccess,
                        translationOptions: {
                            deviceId,
                            methodName,
                            response
                        },
                    },
                    type: NotificationType.success
                })
            });

            expect(success.next()).toEqual({
                done: false,
                value: put(invokeDirectMethodAction.done({
                    params: invokeMethodParameters,
                    result: response
                }))
            });
        });

        it('fails', () => {
            const failed = invokeDirectMethodSagaGenerator.clone();
            const error = { code: -1 };

            expect(failed.throw(error)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokeMethodOnError,
                        translationOptions: {
                            deviceId,
                            error
                        },
                    },
                    type: NotificationType.error
                })
            });

            expect(failed.next(error)).toEqual({
                done: false,
                value: put(invokeDirectMethodAction.failed({
                    error,
                    params: invokeMethodParameters
                }))
            });

            expect(failed.next().done).toEqual(true);
        });

    });
});
