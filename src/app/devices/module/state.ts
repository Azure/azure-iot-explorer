/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { ModuleTwin } from '../../api/models/moduleTwin';
import { ModuleIdentity } from '../../api/models/moduleIdentity';

export interface ModuleStateInterface {
    moduleIdentityList?: SynchronizationWrapper<ModuleIdentity[]>;
    moduleIdentityTwin?: SynchronizationWrapper<ModuleTwin>;
    moduleIdentity?: SynchronizationWrapper<ModuleIdentity>;
}

export const moduleStateInitial = Record<ModuleStateInterface>({
    moduleIdentity: null,
    moduleIdentityList: null,
    moduleIdentityTwin: null,
});
export type ModuleStateType = IM<ModuleStateInterface>;
