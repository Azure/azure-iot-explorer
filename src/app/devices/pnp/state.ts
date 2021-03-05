/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { Twin } from '../../api/models/device';
import { ModuleTwin } from '../../api/models/moduleTwin';

export interface PnpStateInterface {
    twin: SynchronizationWrapper<Twin | ModuleTwin>;
    modelDefinitionWithSource: SynchronizationWrapper<ModelDefinitionWithSource>;
}

export const pnpStateInitial = Record<PnpStateInterface>({
    modelDefinitionWithSource: {
        payload: null,
        synchronizationStatus: SynchronizationStatus.initialized
    },
    twin: {
        payload: null,
        synchronizationStatus: SynchronizationStatus.initialized
    }
});

export type PnpStateType = IM<PnpStateInterface>;
