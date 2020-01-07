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
    startTime?: Date;
    hubConnectionString: string;
    fetchSystemProperties?: boolean;
    consumerGroup: string;
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

export interface FetchDigitalTwinInterfacePropertiesParameters extends DataPlaneParameters {
    digitalTwinId: string; // Format of digitalTwinId is DeviceId[~ModuleId]. ModuleId is optional.
}

export interface InvokeDigitalTwinInterfaceCommandParameters extends DataPlaneParameters {
    digitalTwinId: string; // Format of digitalTwinId is DeviceId[~ModuleId]. ModuleId is optional.
    interfaceName: string;
    commandName: string;
    connectTimeoutInSeconds?: number;
    payload?: any; // tslint:disable-line:no-any
    responseTimeoutInSeconds?: number;
}

export interface PatchDigitalTwinInterfacePropertiesParameters extends DataPlaneParameters {
    digitalTwinId: string; // Format of digitalTwinId is DeviceId[~ModuleId]. ModuleId is optional.
    payload: DigitalTwinInterfaces;
}
