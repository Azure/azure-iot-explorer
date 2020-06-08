/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../../shared/types/types';
import { ModelDefinitionWithSource } from '../../../api/models/modelDefinitionWithSource';
import { SynchronizationWrapper } from '../../../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

export interface PnpStateInterface {
    digitalTwin: SynchronizationWrapper<object>;
    modelDefinitionWithSource: SynchronizationWrapper<ModelDefinitionWithSource>;
}

export const pnpStateInitial = Record<PnpStateInterface>({
    digitalTwin: {
        payload: null,
        synchronizationStatus: SynchronizationStatus.initialized
    },
    modelDefinitionWithSource: {
        payload: null,
        synchronizationStatus: SynchronizationStatus.initialized
    }
});

export type PnpStateType = IM<PnpStateInterface>;
