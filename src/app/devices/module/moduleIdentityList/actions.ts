/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { MODULEIDENTITY } from '../../../constants/actionPrefixes';
import { GET_MODULE_IDENTITIES } from '../../../constants/actionTypes';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { FetchModuleIdentitiesParameters } from '../../../api/parameters/moduleParameters';

export const getModuleIdentitiesAction = actionCreatorFactory(MODULEIDENTITY).async<FetchModuleIdentitiesParameters, ModuleIdentity[]>(GET_MODULE_IDENTITIES);
