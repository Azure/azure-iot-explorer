/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { ModuleIdentityListWrapper } from './../../api/models/moduleIdentityListWrapper';
import { ModuleIdentityTwinWrapper } from './../../api/models/moduleIdentityTwinWrapper';
import { ModuleIdentityWrapper } from './../../api/models/moduleIdentityWrapper';

export interface ModuleStateInterface {
    moduleIdentityList?: ModuleIdentityListWrapper;
    moduleIdentityTwin?: ModuleIdentityTwinWrapper;
    moduleIdentity?: ModuleIdentityWrapper;
}

export const moduleStateInitial = Record<ModuleStateInterface>({
    moduleIdentity: null,
    moduleIdentityList: null,
    moduleIdentityTwin: null,
});
export type ModuleStateType = IM<ModuleStateInterface>;
