/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Type } from 'protobufjs';
import { DeviceIdentity } from '../models/deviceIdentity';
import { DeviceQuery } from '../models/deviceQuery';
import { InvokeMethodActionParameters } from '../../devices/directMethod/actions';
import { CloudToDeviceMessageActionParameters } from '../../devices/cloudToDeviceMessage/actions';
import { DecodeType } from 'src/app/devices/deviceEvents/state';

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
    customEventHubConnectionString?: string;
    hubConnectionString?: string;
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

export interface SetDecoderInfoParameters {
    decodeType: DecodeType;
    decoderFile?: File;
    decoderPrototype?: string;
}