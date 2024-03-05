/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Type } from 'protobufjs';
import { DeviceIdentity } from '../models/deviceIdentity';
import { DeviceQuery } from '../models/deviceQuery';
import { DecodeType } from '../../devices/deviceEvents/state';
import { Twin } from '../models/device';

//#region device CRUD
export interface FetchDeviceParameters {
    connectionString: string;
    deviceId: string;
}

export interface FetchDevicesParameters  {
    connectionString: string;
    query?: DeviceQuery;
}

export interface AddDeviceParameters {
    connectionString: string;
    deviceIdentity: DeviceIdentity;
}

export interface UpdateDeviceParameters {
    connectionString: string;
    deviceIdentity: DeviceIdentity;
}

export interface DeleteDevicesParameters  {
    connectionString: string;
    deviceIds: string[];
}
//#endregion

//#region device twin
export interface FetchDeviceTwinParameters {
    deviceId: string;
    connectionString: string;
}

export interface UpdateDeviceTwinParameters {
    twin: Twin;
    connectionString: string;
}
//#endregion

export interface InvokeMethodParameters {
    connectTimeoutInSeconds: number;
    deviceId: string;
    methodName: string;
    payload?: any; // tslint:disable-line:no-any
    responseTimeoutInSeconds: number;
    connectionString: string;
}

export interface CloudToDeviceMessageParameters {
    deviceId: string;
    body: string;
    connectionString: string;
    properties?: Array<{key: string, value: string, isSystemProperty: boolean}>;
}

export interface MonitorEventsParameters {
    deviceId: string;
    moduleId: string;
    consumerGroup: string;
    customEventHubConnectionString?: string;
    hubConnectionString?: string;
    startTime?: Date;
    decoderPrototype?: Type;
}

export interface SetDecoderInfoParameters {
    decodeType: DecodeType;
    decoderFile?: File;
    decoderPrototype?: string;
}
