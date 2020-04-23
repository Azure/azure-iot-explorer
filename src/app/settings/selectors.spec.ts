/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import {
    getSettingsVisibleSelector,
    getRepositoryLocationSettingsSelector,
    getPublicRepositoryHostName,
    getLocalFolderPath
} from './selectors';
import { getInitialState } from '../api/shared/testHelper';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';

describe('applicationStateSelector', () => {
    const state = getInitialState();

    state.applicationState = Record({
        localFolderSettings: {
          path: 'f:/mist/pnp-docs'
        },
        publicRepositorySettings: {
          publicRepoHostName: 'repo.azureiotrepository.com'
        },
        repositoryLocations: [
            REPOSITORY_LOCATION_TYPE.Public,
            REPOSITORY_LOCATION_TYPE.Local
        ],
        showSettings: true
      })();

    it('returns setting visibility', () => {
        expect(getSettingsVisibleSelector(state)).toEqual(true);
    });

    it('returns repository location settings', () => {
        expect(getRepositoryLocationSettingsSelector(state)).toEqual([
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
                value: null
            },
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                value: 'f:/mist/pnp-docs'
            }
        ]);
    });

    it('returns public repo hostname', () => {
        expect(getPublicRepositoryHostName(state)).toEqual('repo.azureiotrepository.com');
    });

    it('returns local folder path', () => {
        expect(getLocalFolderPath(state)).toEqual('f:/mist/pnp-docs');
    });

});
