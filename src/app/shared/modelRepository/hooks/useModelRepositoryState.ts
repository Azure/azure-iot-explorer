/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setRepositoryLocationsAction } from '../actions';
import { ModelRepositoryStateInterface, getInitialModelRepositoryState } from '../state';
import { modelRepositoryReducer } from '../reducer';
import { ModelRepositoryInterface } from '../interface';
import { useAsyncSagaReducer } from '../../hooks/useAsyncSagaReducer';
import { modelRepositorySaga } from '../saga';

export const useModelRepositoryState = (): [ModelRepositoryStateInterface, ModelRepositoryInterface] => {
    const [state, dispatch] = useAsyncSagaReducer(modelRepositoryReducer, modelRepositorySaga, getInitialModelRepositoryState(), 'modelRepo');
    return [state, {
        setRepositoryLocations: (settings: ModelRepositoryStateInterface) => dispatch(setRepositoryLocationsAction.started(settings)),
    }]
};
