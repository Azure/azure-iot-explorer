/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceIdentity } from '../models/deviceIdentity';
import { DeviceQuery } from '../models/deviceQuery';
import { InvokeMethodActionParameters } from '../../devices/directMethod/actions';
import { CloudToDeviceMessageActionParameters } from '../../devices/cloudToDeviceMessage/actions';
import { Type } from 'protobufjs';

export interface FetchDeviceTwinParameters {
    deviceId: string;
}

export type InvokeMethodParameters = InvokeMethodActionParameters;

export type CloudToDeviceMessageParameters = CloudToDeviceMessageActionParameters;

export interface FetchDeviceParameters {
    deviceId: string;
}

export interface FetchDevicesParameters  {
    query?: DeviceQuery;
}

export interface MonitorEventsParameters {
    deviceId: string;
    moduleId: string;
    consumerGroup: string;
    startListeners: boolean;

    customEventHubName?: string;
    customEventHubConnectionString?: string;
    hubConnectionString?: string;
    startTime?: Date;
    decoderPrototype?: Type;
}

export interface DeleteDevicesParameters  {
    deviceIds: string[];
}

export interface AddDeviceParameters {
    deviceIdentity: DeviceIdentity;
}

export interface UpdateDeviceParameters {
    deviceIdentity: DeviceIdentity;
}
