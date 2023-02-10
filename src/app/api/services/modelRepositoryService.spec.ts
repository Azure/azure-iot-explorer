/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setRepositoryConfigurations,  getRepositoryConfigurations } from './modelRepositoryService';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { REPO_CONFIGURATIONS } from '../../constants/browserStorage';

describe('getRepositoryConfigurations', () => {
    it('returns null when HostMode is not electron', () => {
        expect(getRepositoryConfigurations()).toEqual([{
            repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
            value: ''
        }]);
    });

    it('returns expected value when HostMode is electron', () => {
        localStorage.setItem(REPO_CONFIGURATIONS, JSON.stringify([{
            repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
            value: 'd:/'
        }]));
        expect(getRepositoryConfigurations()).toEqual([{
            repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
            value: 'd:/'
        }]);
    });
});

describe('setRepositoryConfigurations', () => {
    it('filters local when app config is not electron', () => {
        setRepositoryConfigurations([]);
        expect(getRepositoryConfigurations()).toEqual([]);
    });
});
