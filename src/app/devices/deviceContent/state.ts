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
    digitalTwin: SynchronizationWrapper<object>;
    digitalTwinInterfaceProperties: SynchronizationWrapper<DigitalTwinInterfaces>;
    componentNameSelected: string;
    modelDefinitionWithSource: SynchronizationWrapper<ModelDefinitionWithSource>;
}

export const deviceContentStateInitial = Record<DeviceContentStateInterface>({
    componentNameSelected: '',
    deviceIdentity: null,
    deviceTwin: null,
    digitalTwin: null,
    digitalTwinInterfaceProperties: null,
    modelDefinitionWithSource: null
});

export type DeviceContentStateType = IM<DeviceContentStateInterface>;
