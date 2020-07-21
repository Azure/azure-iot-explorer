/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { transformDevice } from './deviceSummaryTransform';
import { Device } from '../models/device';
import { DeviceSummary } from '../models/deviceSummary';

describe('utils', () => {
    describe('transformDevice', () => {
        it('transforms Device to DeviceSummary', () => {
            const device: Device = {
                AuthenticationType: 'Sas',
                CloudToDeviceMessageCount: '0',
                ConnectionState: 'Disconnected',
                DeviceId: 'test',
                IotEdge: false,
                LastActivityTime: '2019-07-18T10:01:20.0568390Z',
                Status: 'Enabled',
                StatusUpdatedTime: null,

            };
            const deviceSummary: DeviceSummary = {
                authenticationType: 'Sas',
                cloudToDeviceMessageCount: '0',
                connectionState: 'Disconnected',
                deviceId: 'test',
                iotEdge: false,
                lastActivityTime: '3:01:20 AM, July 18, 2019',
                status: 'Enabled',
                statusUpdatedTime: null,
            };

            const transformedDevice = transformDevice(device);
            expect(transformedDevice.authenticationType).toEqual(deviceSummary.authenticationType);
            expect(transformedDevice.cloudToDeviceMessageCount).toEqual(deviceSummary.cloudToDeviceMessageCount);
            expect(transformedDevice.connectionState).toEqual(deviceSummary.connectionState);
            expect(transformedDevice.deviceId).toEqual(deviceSummary.deviceId);
            const isLocalTime = new RegExp(/\d+:\d+:\d+ [AP]M, 07\/18\/2019/);
            expect(transformedDevice.iotEdge).toBeFalsy();
            expect(transformedDevice.lastActivityTime.match(isLocalTime)).toBeTruthy();
            expect(transformedDevice.status).toEqual(deviceSummary.status);
            expect(transformedDevice.statusUpdatedTime).toEqual(deviceSummary.statusUpdatedTime);
        });
    });
});
