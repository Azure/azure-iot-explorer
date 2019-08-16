/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { select, call, put } from 'redux-saga/effects';
import { addDeviceSaga } from './addDeviceSaga';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { addDeviceAction } from '../actions';
import * as DevicesService from '../../../api/services/devicesService';
import { getConnectionStringSelector } from '../../../login/selectors';
import { addNotificationAction } from '../../../notifications/actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { DeviceSummary } from '../../../api/models/deviceSummary';

describe('addDeviceSaga', () => {
    let addDeviceSagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const deviceId = 'device_id';
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

    const mockResult: DeviceSummary = {
        authenticationType: 'SAS',
        cloudToDeviceMessageCount: '',
        deviceId,
        lastActivityTime: '',
        status: 'Enabled',
        statusUpdatedTime: ''
    };

    const mockAddDevice = jest.spyOn(DevicesService, 'addDevice').mockImplementationOnce(parameters => {
        return null;
    });

    beforeAll(() => {
        addDeviceSagaGenerator = cloneableGenerator(addDeviceSaga)(addDeviceAction.started(mockDevice));
    });

    it('fetches the connection string', () => {
        expect(addDeviceSagaGenerator.next()).toEqual({
            done: false,
            value: select(getConnectionStringSelector)
        });
    });

    it('adds the device', () => {
        expect(addDeviceSagaGenerator.next(connectionString)).toEqual({
            done: false,
            value: call(mockAddDevice, {
                connectionString,
                deviceIdentity: mockDevice
            })
        });
    });

    it('puts the successful action', () => {
        const success = addDeviceSagaGenerator.clone();
        expect(success.next(mockResult)).toEqual({
            done: false,
            value: put(addNotificationAction.started({
                text: {
                    translationKey: ResourceKeys.notifications.addDeviceOnSucceed,
                    translationOptions: {
                        deviceId
                    },
                },
                type: NotificationType.success
            }))
        });

        expect(success.next()).toEqual({
            done: false,
            value: put(addDeviceAction.done({params: mockDevice, result: mockResult}))
        });

        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = addDeviceSagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: put(addNotificationAction.started({
                text: {
                    translationKey: ResourceKeys.notifications.addDeviceOnError,
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
            value: put(addDeviceAction.failed({params: mockDevice, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
