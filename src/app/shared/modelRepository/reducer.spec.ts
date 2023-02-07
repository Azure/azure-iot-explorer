/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { modelRepositoryReducer } from './reducer';
import { getInitialModelRepositoryState } from './state';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { setRepositoryLocationsAction } from './actions';

describe('modelRepositoryReducer', () => {
    it (`handles MODEL_REPOSITORY/SET_DONE action`, () => {
        const payLoad = [
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
                value: ''
            },
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                value: 'folder'
            }
        ];
        const action = setRepositoryLocationsAction.done({params: payLoad, result: payLoad});
        expect(modelRepositoryReducer(getInitialModelRepositoryState(), action)).toEqual(payLoad);
    });
});
