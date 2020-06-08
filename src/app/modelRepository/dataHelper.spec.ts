/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getRepositoryLocationSettings } from './dataHelper';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { globalStateInitial } from '../shared/global/state';

describe('getRepositoryLocationSettingsSelector', () => {
    it('returns undefined when state is falsy', () => {
        expect(getRepositoryLocationSettings(undefined)).toEqual(undefined);
    });

    it('returns undefined when repositoryLocations is undefined', () => {
        const modelRepositoryState = globalStateInitial().modelRepositoryState;
        modelRepositoryState.repositoryLocations = undefined;
        expect(getRepositoryLocationSettings(modelRepositoryState)).toEqual(undefined);
    });

    it('returns expected array', () => {
        const modelRepositoryState = globalStateInitial().modelRepositoryState;
        modelRepositoryState.repositoryLocations = [
            REPOSITORY_LOCATION_TYPE.Public,
            REPOSITORY_LOCATION_TYPE.Local
        ];

        modelRepositoryState.localFolderSettings = { path: 'folder1' };

        expect(getRepositoryLocationSettings(modelRepositoryState)).toEqual([
            { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public, value: null },
            { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'folder1'}
        ]);
    });
});
