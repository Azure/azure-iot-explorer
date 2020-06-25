/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { MODULEIDENTITY } from '../../../constants/actionPrefixes';
import { ADD_MODULE_IDENTITY } from '../../../constants/actionTypes';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';

export const addModuleIdentityAction = actionCreatorFactory(MODULEIDENTITY).async<ModuleIdentity, ModuleIdentity>(ADD_MODULE_IDENTITY);
