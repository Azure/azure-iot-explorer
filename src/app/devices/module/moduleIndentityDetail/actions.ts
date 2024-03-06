/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { ModuleIdentity } from './../../../api/models/moduleIdentity';
import { MODULEIDENTITY } from '../../../constants/actionPrefixes';
import { DELETE_MODULE_IDENTITY, GET_MODULE_IDENTITY } from '../../../constants/actionTypes';
import { DeleteModuleIdentityParameters, FetchModuleIdentityParameters } from '../../../api/parameters/moduleParameters';

const moduleIdentityCreator = actionCreatorFactory(MODULEIDENTITY);
export const getModuleIdentityAction = moduleIdentityCreator.async<FetchModuleIdentityParameters, ModuleIdentity>(GET_MODULE_IDENTITY);
export const deleteModuleIdentityAction = moduleIdentityCreator.async<DeleteModuleIdentityParameters, void>(DELETE_MODULE_IDENTITY);
