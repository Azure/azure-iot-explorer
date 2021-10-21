/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { addDeviceSagaWorker } from './saga';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { addDeviceAction } from './actions';
import * as DevicesService from '../../api/services/devicesService';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationType } from '../../api/models/notification';

describe('addDeviceSaga', () => {
    let addDeviceSagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const deviceId = 'device_id';
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

    const mockAddDevice = jest.spyOn(DevicesService, 'addDevice').mockImplementationOnce(parameters => {
        return null;
    });

    beforeAll(() => {
        addDeviceSagaGenerator = cloneableGenerator(addDeviceSagaWorker)(addDeviceAction.started(mockDevice));
    });

    it('adds the device', () => {
        expect(addDeviceSagaGenerator.next(connectionString)).toEqual({
            done: false,
            value: call(mockAddDevice, {
                deviceIdentity: mockDevice
            })
        });
    });

    it('puts the successful action', () => {
        const success = addDeviceSagaGenerator.clone();
        expect(success.next(mockDevice)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.addDeviceOnSucceed,
                    translationOptions: {
                        deviceId
                    },
                },
                type: NotificationType.success
            })
        });

        expect(success.next()).toEqual({
            done: false,
            value: put(addDeviceAction.done({params: mockDevice, result: mockDevice}))
        });

        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = addDeviceSagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.addDeviceOnError,
                    translationOptions: {
                        deviceId,
                        error,
                    },
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(addDeviceAction.failed({params: mockDevice, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
