/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setRepositoryLocationsAction } from './actions';
import { getInitialModelRepositoryState, ModelRepositoryStateInterface } from './state';

export const modelRepositoryReducer = reducerWithInitialState<ModelRepositoryStateInterface>(getInitialModelRepositoryState())
    .case(setRepositoryLocationsAction.done, (state: ModelRepositoryStateInterface, payload: {params: ModelRepositoryStateInterface, result: ModelRepositoryStateInterface}) => {
        return payload.result;
    });
