/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getInitialState } from '../api/shared/testHelper';
import { getLocalFolderPathSelector, getRepositoryLocationSettingsSelector } from './selectors';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';

describe('getLocalFolderPath', () => {
    it('returns undefined when state is falsy', () => {
        expect(getLocalFolderPathSelector(undefined)).toEqual(undefined);
    });

    it('returns undefined when modelRepositoryState is falsy', () => {
        const state = getInitialState();
        state.modelRepositoryState = undefined;
        expect(getLocalFolderPathSelector(state)).toEqual(undefined);
    });

    it('returns undefined when localFolderSetting is undefined', () => {
        const state = getInitialState();
        state.modelRepositoryState.localFolderSettings = undefined;
        expect(getLocalFolderPathSelector(state)).toEqual(undefined);
    });

    it('returns localFolderSettings.path', () => {
        const state = getInitialState();
        state.modelRepositoryState.localFolderSettings = {
            path: 'path1'
        }
        expect(getLocalFolderPathSelector(state)).toEqual('path1');
    });
});

describe('getRepositoryLocationSettingsSelector', () => {
    it('returns undefined when state is falsy', () => {
        expect(getRepositoryLocationSettingsSelector(undefined)).toEqual(undefined);
    });

    it('returns undefined when modelRepositoryState is falsy', () => {
        const state = getInitialState();
        state.modelRepositoryState = undefined;
        expect(getRepositoryLocationSettingsSelector(state)).toEqual(undefined);
    });

    it('returns undefined when repositoryLocations is undefined', () => {
        const state = getInitialState();
        state.modelRepositoryState.repositoryLocations = undefined;
        expect(getRepositoryLocationSettingsSelector(state)).toEqual(undefined);
    });

    it('returns expected array', () => {
        const state = getInitialState();
        state.modelRepositoryState.repositoryLocations = [
            REPOSITORY_LOCATION_TYPE.Public,
            REPOSITORY_LOCATION_TYPE.Local
        ];

        state.modelRepositoryState.localFolderSettings = { path: 'folder1' };

        expect(getRepositoryLocationSettingsSelector(state)).toEqual([
            { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public, value: null },
            { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'folder1'}
        ]);
    });
});
