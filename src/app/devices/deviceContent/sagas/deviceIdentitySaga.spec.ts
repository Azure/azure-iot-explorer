/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { select, put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { getDeviceIdentitySaga, updateDeviceIdentitySaga } from './deviceIdentitySaga';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from '../actions';
import { getConnectionStringSelector } from '../../../login/selectors';
import * as DevicesService from '../../../api/services/devicesService';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { addNotificationAction } from '../../../notifications/actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('deviceIdentitySaga', () => {
    let getdeviceIdentitySagaGenerator;
    let updateDeviceIdentitySagaGenerator;

    const mockGetDeviceFn = jest.spyOn(DevicesService, 'fetchDevice').mockImplementationOnce(parameters => {
        return null;
    });
    const mockUpdateDeviceFn = jest.spyOn(DevicesService, 'updateDevice').mockImplementationOnce(parameters => {
        return null;
    });
    const deviceId = 'test_id';
    const mockDevice: DeviceIdentity = {
        authentication: null,
        capabilities: null,
        cloudToDeviceMessageCount: '',
        deviceId,
        etag: 'etag',
        lastActivityTime: '',
        status: 'Enabled',
        statusReason: '',
        statusUpdatedTime: ''
    };

    beforeEach(() => {
        getdeviceIdentitySagaGenerator = cloneableGenerator(getDeviceIdentitySaga)(getDeviceIdentityAction.started(deviceId));
        updateDeviceIdentitySagaGenerator = cloneableGenerator(updateDeviceIdentitySaga)(updateDeviceIdentityAction.started(mockDevice));
    });

    describe('getDeviceIdentitySaga', () => {

        it('fetches the device identity', () => {
            // get connection string
            expect(getdeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: select(getConnectionStringSelector)
            });

            // call for device id
            expect(getdeviceIdentitySagaGenerator.next('connection_string')).toEqual({
                done: false,
                value: call(mockGetDeviceFn, {connectionString: 'connection_string', deviceId})
            });

            // add to store
            expect(getdeviceIdentitySagaGenerator.next(mockDevice)).toEqual({
                done: false,
                value: put(getDeviceIdentityAction.done({
                    params: deviceId,
                    result: mockDevice
                }))
            });

            // done
            expect(getdeviceIdentitySagaGenerator.next()).toEqual({
                done: true
            });
        });

        it('fails on error', () => {
            const error = { code: -1 };
            getdeviceIdentitySagaGenerator.next();
            expect(getdeviceIdentitySagaGenerator.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.getDeviceIdentityOnError,
                        translationOptions: {
                            deviceId,
                            error
                        },
                    },
                    type: NotificationType.error
                }))
            });

            expect(getdeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: put(getDeviceIdentityAction.failed({
                    error,
                    params: deviceId,
                }))
            });

            // done
            expect(getdeviceIdentitySagaGenerator.next()).toEqual({
                done: true
            });
        });
    });

    describe('updateDeviceIdentitySaga', () => {

        it('updates the device identity', () => {
            // get connection string
            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: select(getConnectionStringSelector)
            });

            // call to update
            expect(updateDeviceIdentitySagaGenerator.next('connection_string')).toEqual({
                done: false,
                value: call(mockUpdateDeviceFn, {connectionString: 'connection_string', deviceIdentity: mockDevice})
            });

            // notification
            expect(updateDeviceIdentitySagaGenerator.next(mockDevice)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.updateDeviceOnSucceed,
                        translationOptions: {
                           deviceId: mockDevice.deviceId,
                        },
                    },
                    type: NotificationType.success
                }))
            });

            // add to store
            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: put(updateDeviceIdentityAction.done({
                    params: mockDevice,
                    result: mockDevice
                }))
            });

            // done
            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: true
            });
        });

        it('fails on error', () => {
            const error = { code: -1 };
            updateDeviceIdentitySagaGenerator.next();
            expect(updateDeviceIdentitySagaGenerator.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.updateDeviceOnError,
                        translationOptions: {
                            deviceId: mockDevice.deviceId,
                            error,
                        },
                    },
                    type: NotificationType.error
                }))
            });

            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: put(updateDeviceIdentityAction.failed({
                    error,
                    params: mockDevice,
                }))
            });

            // done
            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: true
            });
        });
    });
});
