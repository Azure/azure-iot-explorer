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
                lastActivityTime: '3:01:20 AM, July 18, 2019',
                status: 'Enabled',
                statusUpdatedTime: null,
            };
            expect(transformDevice(device)).toEqual(deviceSummary);
        });
    });
});
