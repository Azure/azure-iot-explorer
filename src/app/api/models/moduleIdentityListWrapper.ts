/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModuleIdentity } from './moduleIdentity';
import { SynchronizationStatus } from './synchronizationStatus';

export interface ModuleIdentityListWrapper {
    moduleIdentities?: ModuleIdentity[];
    synchronizationStatus: SynchronizationStatus;
}
