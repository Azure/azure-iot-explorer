/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator, SagaIteratorClone } from '@redux-saga/testing-utils';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as ModuleService from '../../../api/services/moduleService';
import { invokeModuleDirectMethodSaga, invokeModuleDirectMethodSagaWorker, notifyModuleMethodInvokedHelper } from './saga';
import { invokeModuleDirectMethodAction } from './actions';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { InvokeModuleMethodParameters } from '../../../api/parameters/moduleParameters';

describe('directMethodSagaWorker', () => {
    let invokeDirectMethodSagaGenerator: SagaIteratorClone;
    let notifyMethodInvokedGenerator: SagaIteratorClone;

    const mockInvokeDirectMethod = jest.spyOn(ModuleService, 'invokeModuleDirectMethod').mockImplementation(parameters => {
        return null;
    });

    const randomNumber = 0;

    jest.spyOn(Math, 'random').mockImplementation(() => {
        return randomNumber;
    });

    const connectTimeoutInSeconds = 10;
    const deviceId = 'device_id';
    const moduleId = 'module_id';
    const methodName = 'test';
    const payload = {
        body: 'test'
    };
    const responseTimeoutInSeconds = 10;

    const invokeModuleMethodParameters: InvokeModuleMethodParameters = {
        connectTimeoutInSeconds,
        deviceId,
        methodName,
        moduleId,
        payload,
        responseTimeoutInSeconds
    };

    beforeAll(() => {
        invokeDirectMethodSagaGenerator = cloneableGenerator(invokeModuleDirectMethodSagaWorker)(invokeModuleDirectMethodAction.started(invokeModuleMethodParameters));
    });

    beforeEach(() => {
        notifyMethodInvokedGenerator = cloneableGenerator(notifyModuleMethodInvokedHelper)(randomNumber, invokeModuleMethodParameters);
    });

    describe('notifyMethodInvokedHelper', () => {
        it('puts a notification with payload if there is a payload', () => {
            expect(notifyMethodInvokedGenerator.next()).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokingModuleMethodWithPayload,
                        translationOptions: {
                            deviceId,
                            methodName,
                            moduleId,
                            payload: JSON.stringify(payload),
                        },
                    },
                    type: NotificationType.info
                })
            });

            expect(notifyMethodInvokedGenerator.next().done).toEqual(true);
        });
    });

    describe('invokeDirectMethodSagaWorker', () => {
        it('notifies that the method is being invoked', () => {
            expect(invokeDirectMethodSagaGenerator.next(randomNumber)).toEqual({
                done: false,
                value: call(notifyModuleMethodInvokedHelper, randomNumber, invokeModuleMethodParameters)
            });
        });

        it('successfully invokes the method', () => {
            const success = invokeDirectMethodSagaGenerator.clone();

            expect(success.next()).toEqual({
                done: false,
                value: call(mockInvokeDirectMethod, invokeModuleMethodParameters)
            });

            const response = 'hello';

            expect(success.next(response)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.invokeModuleMethodOnSuccess,
                        translationOptions: {
                            deviceId,
                            methodName,
                            moduleId,
                            response
                        },
                    },
                    type: NotificationType.success
                })
            });

            expect(success.next()).toEqual({
                done: false,
                value: put(invokeModuleDirectMethodAction.done({
                    params: invokeModuleMethodParameters,
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
                        translationKey: ResourceKeys.notifications.invokeModuleMethodOnError,
                        translationOptions: {
                            deviceId,
                            error,
                            moduleId
                        },
                    },
                    type: NotificationType.error
                })
            });

            expect(failed.next(error)).toEqual({
                done: false,
                value: put(invokeModuleDirectMethodAction.failed({
                    error,
                    params: invokeModuleMethodParameters
                }))
            });

            expect(failed.next().done).toEqual(true);
        });

    });
});

describe('directMethodSaga', () => {
    it('returns specified sagas', () => {
        expect(invokeModuleDirectMethodSaga().next().value).toEqual(
            takeEvery(invokeModuleDirectMethodAction.started.type, invokeModuleDirectMethodSagaWorker)
        );
    });
});
