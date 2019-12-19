/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModuleTwin } from './moduleIdentity';
import { SynchronizationStatus } from './synchronizationStatus';

export interface ModuleIdentityTwinWrapper {
    moduleIdentityTwin?: ModuleTwin;
    synchronizationStatus: SynchronizationStatus;
}
