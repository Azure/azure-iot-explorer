/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceIdentity } from '../models/deviceIdentity';
import { DeviceQuery } from '../models/deviceQuery';
import { InvokeMethodActionParameters } from '../../devices/directMethod/actions';
import { CloudToDeviceMessageActionParameters } from '../../devices/cloudToDeviceMessage/actions';

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
    consumerGroup: string;

    customEventHubName?: string;
    customEventHubConnectionString?: string;
    hubConnectionString?: string;

    startTime?: Date;
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

export interface FetchDigitalTwinParameters {
    digitalTwinId: string;
}

export enum JsonPatchOperation {
    ADD = 'add',
    REMOVE = 'remove'
}

export interface PatchDigitalTwinParameters {
    digitalTwinId: string; // Format of digitalTwinId is DeviceId[~ModuleId]. ModuleId is optional.
    payload: PatchPayload[];
}

export interface PatchPayload {
    op: JsonPatchOperation;
    path: string;
    value?: boolean | number | string | object;
}

export interface InvokeDigitalTwinInterfaceCommandParameters {
    digitalTwinId: string; // Format of digitalTwinId is DeviceId[~ModuleId]. ModuleId is optional.
    componentName: string;
    commandName: string;
    connectTimeoutInSeconds?: number;
    payload?: boolean | number | string | object;
    responseTimeoutInSeconds?: number;
}
