/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../../shared/types/types';
import { SynchronizationWrapper } from '../../../api/models/synchronizationWrapper';
import { ModuleTwin } from '../../../api/models/moduleTwin';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

export interface ModuleTwinStateInterface extends SynchronizationWrapper<ModuleTwin> {}

export const moduleTwinStateInitial = Record<ModuleTwinStateInterface>({
    payload: undefined,
    synchronizationStatus: SynchronizationStatus.initialized
});

export type ModuleTwinStateType = IM<ModuleTwinStateInterface>;
