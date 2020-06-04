/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';

export interface DeviceContentStateInterface {
    deviceIdentity: SynchronizationWrapper<DeviceIdentity>;
    digitalTwin: SynchronizationWrapper<object>;
    componentNameSelected: string;
    modelDefinitionWithSource: SynchronizationWrapper<ModelDefinitionWithSource>;
}

export const deviceContentStateInitial = Record<DeviceContentStateInterface>({
    componentNameSelected: '',
    deviceIdentity: null,
    digitalTwin: null,
    modelDefinitionWithSource: null
});

export type DeviceContentStateType = IM<DeviceContentStateInterface>;
