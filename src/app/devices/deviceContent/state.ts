/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';

export interface DeviceContentStateInterface {
    digitalTwin: SynchronizationWrapper<object>;
    componentNameSelected: string;
    modelDefinitionWithSource: SynchronizationWrapper<ModelDefinitionWithSource>;
}

export const deviceContentStateInitial = Record<DeviceContentStateInterface>({
    componentNameSelected: '',
    digitalTwin: null,
    modelDefinitionWithSource: null
});

export type DeviceContentStateType = IM<DeviceContentStateInterface>;
