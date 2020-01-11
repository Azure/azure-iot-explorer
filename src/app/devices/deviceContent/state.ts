/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { Twin } from './../../api/models/device';
import { DigitalTwinInterfaces } from '../../api/models/digitalTwinModels';

export interface DeviceContentStateInterface {
    deviceIdentity: SynchronizationWrapper<DeviceIdentity>;
    deviceTwin: SynchronizationWrapper<Twin>;
    digitalTwinInterfaceProperties: SynchronizationWrapper<DigitalTwinInterfaces>;
    interfaceIdSelected: string;
    modelDefinitionWithSource: SynchronizationWrapper<ModelDefinitionWithSource>;
}

export const deviceContentStateInitial = Record<DeviceContentStateInterface>({
    deviceIdentity: null,
    deviceTwin: null,
    digitalTwinInterfaceProperties: null,
    interfaceIdSelected: '',
    modelDefinitionWithSource: null
});

export type DeviceContentStateType = IM<DeviceContentStateInterface>;
