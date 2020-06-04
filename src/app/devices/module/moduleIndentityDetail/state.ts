/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../../shared/types/types';
import { SynchronizationWrapper } from '../../../api/models/synchronizationWrapper';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

export interface ModuleIdentityDetailStateInterface extends SynchronizationWrapper<ModuleIdentity>{}

export const moduleIdentityDetailStateInterfaceInitial = Record<ModuleIdentityDetailStateInterface>({
    payload: null,
    synchronizationStatus: SynchronizationStatus.initialized
});

export type ModuleIdentityDetailStateType = IM<ModuleIdentityDetailStateInterface>;
