/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface } from '../../shared/redux/state';
import { ModuleIdentityListWrapper } from '../../api/models/moduleIdentityListWrapper';
import { ModuleIdentityTwinWrapper } from './../../api/models/moduleIdentityTwinWrapper';
import { ModuleIdentityWrapper } from './../../api/models/moduleIdentityWrapper';

export const getModuleIdentityListWrapperSelector = (state: StateInterface): ModuleIdentityListWrapper => {
    return state &&
        state.moduleState &&
        state.moduleState.moduleIdentityList;
};

export const getModuleIdentityTwinWrapperSelector = (state: StateInterface): ModuleIdentityTwinWrapper => {
    return state &&
        state.moduleState &&
        state.moduleState.moduleIdentityTwin;
};

export const getModuleIdentityWrapperSelector = (state: StateInterface): ModuleIdentityWrapper => {
    return state &&
        state.moduleState &&
        state.moduleState.moduleIdentity;
};
