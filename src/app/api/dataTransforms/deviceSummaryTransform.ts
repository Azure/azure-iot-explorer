/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceSummary } from '../models/deviceSummary';
import { parseDateTimeString } from './transformHelper';
import { Device } from '../models/device';

export const transformDevice = (device: Device): DeviceSummary => {
    return {
        authenticationType: device.AuthenticationType,
        cloudToDeviceMessageCount: device.CloudToDeviceMessageCount,
        connectionState: device.ConnectionState,
        deviceId: device.DeviceId,
        iotEdge: device.IotEdge,
        lastActivityTime: parseDateTimeString(device.LastActivityTime),
        modelId: device.ModelId,
        status: device.Status,
        statusUpdatedTime: parseDateTimeString(device.StatusUpdatedTime)
    };
};
