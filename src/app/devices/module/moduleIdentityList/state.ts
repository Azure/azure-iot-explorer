/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../../shared/types/types';
import { SynchronizationWrapper } from '../../../api/models/synchronizationWrapper';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

export interface ModuleIndentityListStateInterface extends SynchronizationWrapper<ModuleIdentity[]>{}

export const moduleIndentityListStateInitial = Record<ModuleIndentityListStateInterface>({
    payload: [],
    synchronizationStatus: SynchronizationStatus.initialized
});

export type ModuleIndentityListStateType = IM<ModuleIndentityListStateInterface>;
