/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../constants/actionPrefixes';
import { SET } from '../constants/actionTypes';
import { RepositoryLocationSettings } from './state';

const factory = actionCreatorFactory(actionPrefixes.MODEL_REPOSITORY);
export const setRepositoryLocationsAction = factory<RepositoryLocationSettings[]>(SET);
