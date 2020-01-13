/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { StateInterface } from '../../shared/redux/state';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { ModuleTwin } from './../../api/models/moduleTwin';
import { ModuleIdentity } from './../../api/models/moduleIdentity';

export const getModuleIdentityListWrapperSelector = (state: StateInterface): SynchronizationWrapper<ModuleIdentity[]> => {
    return state &&
        state.moduleState &&
        state.moduleState.moduleIdentityList;
};

export const getModuleIdentityListSyncStatusSelector = createSelector(
    getModuleIdentityListWrapperSelector,
    wrapper => wrapper && wrapper.synchronizationStatus);

export const getModuleIdentityTwinWrapperSelector = (state: StateInterface): SynchronizationWrapper<ModuleTwin> => {
    return state &&
        state.moduleState &&
        state.moduleState.moduleIdentityTwin;
};

export const getModuleIdentityWrapperSelector = (state: StateInterface): SynchronizationWrapper<ModuleIdentity> => {
    return state &&
        state.moduleState &&
        state.moduleState.moduleIdentity;
};
