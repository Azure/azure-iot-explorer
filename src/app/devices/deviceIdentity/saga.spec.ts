/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { put, call } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { getDeviceIdentitySagaWorker, updateDeviceIdentitySagaWorker } from './saga';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from './actions';
import * as DevicesService from '../../api/services/devicesService';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationType } from '../../api/models/notification';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';

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
    const connectionString = 'connection_string';
    const params = {connectionString, deviceId};
    const mockDevice: DeviceIdentity = {
        authentication: null,
        capabilities: null,
        cloudToDeviceMessageCount: 1,
        deviceId,
        etag: 'etag',
        lastActivityTime: '',
        status: 'Enabled',
        statusReason: '',
        statusUpdatedTime: ''
    };
    const identityParams = {connectionString, deviceIdentity: mockDevice};

    beforeEach(() => {
        getdeviceIdentitySagaGenerator = cloneableGenerator(getDeviceIdentitySagaWorker)(getDeviceIdentityAction.started(params));
        updateDeviceIdentitySagaGenerator = cloneableGenerator(updateDeviceIdentitySagaWorker)(updateDeviceIdentityAction.started(identityParams));
    });

    describe('getDeviceIdentitySaga', () => {

        it('fetches the device identity', () => {
            // call for device id
            expect(getdeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: call(mockGetDeviceFn, params)
            });

            // add to store
            expect(getdeviceIdentitySagaGenerator.next(mockDevice)).toEqual({
                done: false,
                value: put(getDeviceIdentityAction.done({
                    params,
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
                value: call(raiseNotificationToast, {
                    text: {
                        translationKey: ResourceKeys.notifications.getDeviceIdentityOnError,
                        translationOptions: {
                            deviceId,
                            error
                        },
                    },
                    type: NotificationType.error
                })
            });

            expect(getdeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: put(getDeviceIdentityAction.failed({
                    error,
                    params,
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
            // call to update
            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: call(mockUpdateDeviceFn, identityParams)
            });

            // notification
            expect(updateDeviceIdentitySagaGenerator.next(mockDevice)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    text: {
                        translationKey: ResourceKeys.notifications.updateDeviceOnSucceed,
                        translationOptions: {
                           deviceId: mockDevice.deviceId,
                        },
                    },
                    type: NotificationType.success
                })
            });

            // add to store
            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: put(updateDeviceIdentityAction.done({
                    params: identityParams,
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
                value: call(raiseNotificationToast, {
                    text: {
                        translationKey: ResourceKeys.notifications.updateDeviceOnError,
                        translationOptions: {
                            deviceId: mockDevice.deviceId,
                            error,
                        },
                    },
                    type: NotificationType.error
                })
            });

            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: put(updateDeviceIdentityAction.failed({
                    error,
                    params: identityParams,
                }))
            });

            // done
            expect(updateDeviceIdentitySagaGenerator.next()).toEqual({
                done: true
            });
        });
    });
});
