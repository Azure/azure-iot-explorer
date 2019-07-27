/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceSummary } from '../models/deviceSummary';
import { parseDateTimeString } from './transformHelper';
import { Device } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';

export const transformDevice = (device: Device): DeviceSummary => {
    return {
        authenticationType: device.AuthenticationType,
        cloudToDeviceMessageCount: device.CloudToDeviceMessageCount,
        deviceId: device.DeviceId,
        lastActivityTime: parseDateTimeString(device.LastActivityTime),
        status: device.Status,
        statusUpdatedTime: parseDateTimeString(device.StatusUpdatedTime)
    };
};

export const transformDeviceIdentity = (device: DeviceIdentity): DeviceSummary => {
    return {
        authenticationType: device.authentication.type,
        cloudToDeviceMessageCount: device.cloudToDeviceMessageCount,
        deviceId: device.deviceId,
        lastActivityTime: parseDateTimeString(device.lastActivityTime),
        status: device.status,
        statusUpdatedTime: parseDateTimeString(device.statusUpdatedTime)
    };
};
