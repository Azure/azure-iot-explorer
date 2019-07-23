/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceSummary } from '../models/deviceSummary';
import { parseDateTimeString } from './transformHelper';
import { Device } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import { SynchronizationStatus } from '../models/synchronizationStatus';

export const transformDevice = (device: Device): DeviceSummary => {
    return {
        authenticationType: device.AuthenticationType,
        cloudToDeviceMessageCount: device.CloudToDeviceMessageCount,
        deviceId: device.DeviceId,
        deviceSummarySynchronizationStatus: SynchronizationStatus.initialized,
        interfaceIds: [],
        isEdgeDevice: device.IotEdge,
        isPnpDevice: undefined,
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
        deviceSummarySynchronizationStatus: SynchronizationStatus.initialized,
        interfaceIds: [],
        isEdgeDevice: device.capabilities.iotEdge,
        isPnpDevice: false, // device created using add device api won't be pnp device
        lastActivityTime: parseDateTimeString(device.lastActivityTime),
        status: device.status,
        statusUpdatedTime: parseDateTimeString(device.statusUpdatedTime)
    };
};
