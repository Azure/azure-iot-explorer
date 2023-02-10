/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { MODEL_REPOSITORY } from '../../constants/actionPrefixes';
import { SET } from '../../constants/actionTypes';
import { ModelRepositoryStateInterface } from './state';

const modelRepositoryFactory = actionCreatorFactory(MODEL_REPOSITORY);
export const setRepositoryLocationsAction = modelRepositoryFactory.async<ModelRepositoryStateInterface, ModelRepositoryStateInterface>(SET);
