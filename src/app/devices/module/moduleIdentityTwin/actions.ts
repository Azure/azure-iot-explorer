/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { MODULEIDENTITY } from '../../../constants/actionPrefixes';
import { GET_MODULE_IDENTITY_TWIN, UPDATE_MODULE_IDENTITY_TWIN } from '../../../constants/actionTypes';
import { ModuleTwin } from '../../../api/models/moduleTwin';

export const getModuleIdentityTwinAction = actionCreatorFactory(MODULEIDENTITY).async<GetModuleIdentityTwinActionParameters, ModuleTwin>(GET_MODULE_IDENTITY_TWIN);
export const updateModuleIdentityTwinAction = actionCreatorFactory(MODULEIDENTITY).async<ModuleTwin, ModuleTwin>(UPDATE_MODULE_IDENTITY_TWIN);

export interface GetModuleIdentityTwinActionParameters {
    moduleId: string;
    deviceId: string;
}
