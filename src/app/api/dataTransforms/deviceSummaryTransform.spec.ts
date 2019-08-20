/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { transformDevice, transformDeviceIdentity } from './deviceSummaryTransform';
import { Device } from '../models/device';
import { DeviceSummary } from '../models/deviceSummary';
import { DeviceIdentity } from '../models/deviceIdentity';

describe('utils', () => {

    describe('transformDevice', () => {
        it('transforms Device to DeviceSummary', () => {
            const device: Device = {
                AuthenticationType: 'Sas',
                CloudToDeviceMessageCount: '0',
                DeviceId: 'test',
                IotEdge: false,
                LastActivityTime: '2019-07-18T10:01:20.0568390Z',
                Status: 'Enabled',
                StatusUpdatedTime: null,

            };
            const deviceSummary: DeviceSummary = {
                authenticationType: 'Sas',
                cloudToDeviceMessageCount: '0',
                deviceId: 'test',
                lastActivityTime: '10:01 AM, July 18, 2019',
                status: 'Enabled',
                statusUpdatedTime: null,
            };
            expect(transformDevice(device)).toEqual(deviceSummary);
        });
    });

    describe('transformDeviceIdentity', () => {
        it('transforms DeviceIdentity to DeviceSummary', () => {
            const deviceIdentity: DeviceIdentity = {
                authentication: {
                    symmetricKey: null,
                    type: 'sas',
                    x509Thumbprint: null
                },
                capabilities: {iotEdge: false},
                cloudToDeviceMessageCount: 0,
                deviceId: 'test',
                etag: 'MTI2NTA2ODQ4',
                lastActivityTime: '0001-01-01T00:00:00',
                status: 'enabled',
                statusReason: null,
                statusUpdatedTime: '0001-01-01T00:00:00'
            };
            const deviceSummary: DeviceSummary = {
                authenticationType: 'sas',
                cloudToDeviceMessageCount: '0',
                deviceId: 'test',
                lastActivityTime: null,
                status: 'enabled',
                statusUpdatedTime: null,
            };
            expect(transformDeviceIdentity(deviceIdentity)).toEqual(deviceSummary);
        });
    });
});
