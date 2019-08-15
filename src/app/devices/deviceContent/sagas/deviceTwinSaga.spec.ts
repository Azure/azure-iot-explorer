/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { select, call, put } from 'redux-saga/effects';
import { getDeviceTwinSaga, updateDeviceTwinSaga } from './deviceTwinSaga';
import { getTwinAction, updateTwinAction } from '../actions';
import { getConnectionStringSelector } from '../../../login/selectors';
import * as DevicesService from '../../../api/services/devicesService';
import { Twin } from '../../../api/models/device';
import { addNotificationAction } from '../../../notifications/actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('deviceTwinSaga', () => {
    let getDeviceTwinSagaGenerator: SagaIteratorClone;
    let updateDeviceTwinSagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const deviceId = 'device_id';

    const mockTwin: Twin = {
        authenticationType: 'SymmetricKey',
        capabilities: {
            iotEdge: false
        },
        cloudToDeviceMessageCount: 0,
        connectionState: 'Connected',
        deviceEtag: 'etag',
        deviceId,
        etag: 'etag',
        lastActivityTime: new Date().toUTCString(),
        properties: null,
        status: 'enabled',
        statusUpdateTime: new Date().toUTCString(),
        version: 1,
        x509Thumbprint: null
    };

    describe('updateDeviceTwinSaga', () => {
        beforeAll(() => {
            updateDeviceTwinSagaGenerator = cloneableGenerator(updateDeviceTwinSaga)(updateTwinAction.started({
                deviceId,
                twin: mockTwin
            }));
        });

        const mockUpdateDeviceTwin = jest.spyOn(DevicesService, 'updateDeviceTwin').mockImplementationOnce(parameters => {
            return null;
        });

        it('fetches the connection string', () => {
            expect(updateDeviceTwinSagaGenerator.next()).toEqual({
                done: false,
                value: select(getConnectionStringSelector)
            });
        });

        it('updates the device twin', () => {
            expect(updateDeviceTwinSagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockUpdateDeviceTwin, {
                    connectionString,
                    deviceId,
                    deviceTwin: mockTwin
                })
            });
        });

        it('puts the successful action', () => {
            const success = updateDeviceTwinSagaGenerator.clone();
            expect(success.next(mockTwin)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.updateDeviceTwinOnSuccess,
                        translationOptions: {
                            deviceId
                        },
                    },
                    type: NotificationType.success
                  }))
            });
            expect(success.next()).toEqual({
                done: false,
                value: put(updateTwinAction.done({params: { deviceId, twin: mockTwin}, result: mockTwin}))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = updateDeviceTwinSagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.updateDeviceTwinOnError,
                        translationOptions: {
                            deviceId,
                            error,
                        },
                    },
                    type: NotificationType.error
                  }))
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(updateTwinAction.failed({params: { deviceId, twin: mockTwin}, error}))
            });
            expect(failure.next().done).toEqual(true);
        });
    });

    describe('getDeviceTwinSaga', () => {

        beforeAll(() => {
            getDeviceTwinSagaGenerator = cloneableGenerator(getDeviceTwinSaga)(getTwinAction.started(deviceId));
        });

        const mockFetchDeviceTwin = jest.spyOn(DevicesService, 'fetchDeviceTwin').mockImplementationOnce(parameters => {
            return null;
        });

        it('fetches the connection string', () => {
            expect(getDeviceTwinSagaGenerator.next()).toEqual({
                done: false,
                value: select(getConnectionStringSelector)
            });
        });

        it('fetches the device twin', () => {
            expect(getDeviceTwinSagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockFetchDeviceTwin, { connectionString, deviceId })
            });
        });

        it('puts the successful action', () => {
            const success = getDeviceTwinSagaGenerator.clone();
            expect(success.next(mockTwin)).toEqual({
                done: false,
                value: put(getTwinAction.done({params: deviceId, result: mockTwin}))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = getDeviceTwinSagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.getDeviceTwinOnError,
                        translationOptions: {
                            deviceId,
                            error,
                        },
                    },
                    type: NotificationType.error
                }))
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(getTwinAction.failed({params: deviceId, error}))
            });
            expect(failure.next().done).toEqual(true);
        });

    });

});
