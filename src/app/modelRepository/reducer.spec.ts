/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setRepositoryLocationsAction } from './actions';
import reducer from './reducer';
import { modelRepositoryStateInitial } from './state';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';

describe('reducer', () => {
    it (`handles MODEL_REPOSITORY/SET action with only public repo location`, () => {
        const payLoad = [
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public
            }
        ];
        const action = setRepositoryLocationsAction(payLoad);
        expect(reducer(modelRepositoryStateInitial(), action).repositoryLocations).toEqual([REPOSITORY_LOCATION_TYPE.Public]);
    });
 });