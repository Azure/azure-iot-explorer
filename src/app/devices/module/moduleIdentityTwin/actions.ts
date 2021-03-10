/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../../constants/actionPrefixes';
import { GET_MODULE_IDENTITY_TWIN, UPDATE_MODULE_IDENTITY_TWIN } from '../../../constants/actionTypes';
import { ModuleTwin } from '../../../api/models/moduleTwin';

export const getModuleIdentityTwinAction = actionCreatorFactory(DEVICECONTENT).async<GetModuleIdentityTwinActionParameters, ModuleTwin>(GET_MODULE_IDENTITY_TWIN);
export const updateModuleIdentityTwinAction = actionCreatorFactory(DEVICECONTENT).async<ModuleTwin, ModuleTwin>(UPDATE_MODULE_IDENTITY_TWIN);

export interface GetModuleIdentityTwinActionParameters {
    moduleId: string;
    deviceId: string;
}
