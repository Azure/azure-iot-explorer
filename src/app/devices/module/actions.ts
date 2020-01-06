/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { ModuleIdentity } from './../../api/models/moduleIdentity';
import { ModuleTwin } from './../../api/models/moduleTwin';

const moduleIdentityCreator = actionCreatorFactory(actionPrefixes.MODULEIDENTITY);
const getModuleIdentitiesAction = moduleIdentityCreator.async<string, ModuleIdentity[]>(actionTypes.GET_MODULE_IDENTITIES);
const addModuleIdentityAction = moduleIdentityCreator.async<ModuleIdentity, ModuleIdentity>(actionTypes.ADD_MODULE_IDENTITY);
const getModuleIdentityTwinAction = moduleIdentityCreator.async<GetModuleIdentityTwinActionParameters, ModuleTwin>(actionTypes.GET_MODULE_IDENTITY_TWIN);
const getModuleIdentityAction = moduleIdentityCreator.async<GetModuleIdentityActionParameters, ModuleIdentity>(actionTypes.GET_MODULE_IDENTITY);
const deleteModuleIdentityAction = moduleIdentityCreator.async<DeleteModuleIdentityActionParameters, void>(actionTypes.DELETE_MODULE_IDENTITY);

export {
    addModuleIdentityAction,
    deleteModuleIdentityAction,
    getModuleIdentitiesAction,
    getModuleIdentityAction,
    getModuleIdentityTwinAction
};

export interface GetModuleIdentityTwinActionParameters {
    moduleId: string;
    deviceId: string;
}

export interface GetModuleIdentityActionParameters {
    moduleId: string;
    deviceId: string;
}

export interface DeleteModuleIdentityActionParameters {
    moduleId: string;
    deviceId: string;
}
