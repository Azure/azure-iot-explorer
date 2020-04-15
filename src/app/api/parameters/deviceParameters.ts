/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Twin } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import DeviceQuery from '../models/deviceQuery';
import { DigitalTwinInterfaces } from '../models/digitalTwinModels';
import { CloudToDeviceMessageActionParameters, InvokeMethodActionParameters } from '../../devices/deviceContent/actions';

export interface DataPlaneParameters {
    connectionString: string;
}

export interface FetchDeviceTwinParameters extends DataPlaneParameters {
    deviceId: string;
}

export interface UpdateDeviceTwinParameters extends FetchDeviceTwinParameters {
    deviceTwin: Twin;
}

export type InvokeMethodParameters = InvokeMethodActionParameters & DataPlaneParameters;

export type CloudToDeviceMessageParameters = CloudToDeviceMessageActionParameters & DataPlaneParameters;

export interface FetchDeviceParameters extends DataPlaneParameters {
    deviceId: string;
}

export interface FetchDevicesParameters extends DataPlaneParameters {
    query?: DeviceQuery;
}

export interface MonitorEventsParameters {
    deviceId: string;
    consumerGroup: string;

    customEventHubConnectionString?: string;
    hubConnectionString?: string;

    fetchSystemProperties?: boolean;
    startTime?: Date;
}

export interface DeleteDevicesParameters extends DataPlaneParameters {
    deviceIds: string[];
}

export interface AddDeviceParameters extends DataPlaneParameters {
    deviceIdentity: DeviceIdentity;
}

export interface UpdateDeviceParameters extends DataPlaneParameters {
    deviceIdentity: DeviceIdentity;
}

export interface FetchDigitalTwinParameters extends DataPlaneParameters {
    digitalTwinId: string;
}

export interface PatchDigitalTwinInterfacePropertiesParameters extends DataPlaneParameters {
    digitalTwinId: string; // Format of digitalTwinId is DeviceId[~ModuleId]. ModuleId is optional.
    payload: DigitalTwinInterfaces;
}

export interface InvokeDigitalTwinInterfaceCommandParameters extends DataPlaneParameters {
    digitalTwinId: string; // Format of digitalTwinId is DeviceId[~ModuleId]. ModuleId is optional.
    componentName: string;
    commandName: string;
    connectTimeoutInSeconds?: number;
    payload?: any; // tslint:disable-line:no-any
    responseTimeoutInSeconds?: number;
}
