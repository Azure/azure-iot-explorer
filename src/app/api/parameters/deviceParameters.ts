/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Twin } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import DeviceQuery from '../models/deviceQuery';
import { DigitalTwinInterfaces } from '../models/digitalTwinModels';
import { ModuleIdentity } from '../models/moduleIdentity';

export interface DataPlaneParameters {
    connectionString: string;
}

export interface FetchDeviceTwinParameters extends DataPlaneParameters {
    deviceId: string;
}

export interface UpdateDeviceTwinParameters extends FetchDeviceTwinParameters {
    deviceTwin: Twin;
}

export interface InvokeMethodParameters extends DataPlaneParameters {
    connectTimeoutInSeconds: number;
    deviceId: string;
    methodName: string;
    payload?: object;
    responseTimeoutInSeconds: number;
}

export interface CloudToDeviceMessageParameters extends DataPlaneParameters {
    deviceId: string;
    body: string;
    properties?: Array<{key: string, value: string, isSystemProperty: boolean}>;
}

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

export interface FetchModuleIdentitiesParameters extends DataPlaneParameters {
    deviceId: string;
}

export interface AddModuleIdentityParameters extends DataPlaneParameters {
    moduleIdentity: ModuleIdentity;
}
