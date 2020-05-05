/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface } from '../shared/redux/state';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';

export const getRepositoryLocationSettingsSelector = (state: StateInterface) => {
    return state && state.modelRepositoryState && state.modelRepositoryState.repositoryLocations && state.modelRepositoryState.repositoryLocations.map(item => {
        return {
            repositoryLocationType: item,
            value:
                (item === REPOSITORY_LOCATION_TYPE.Local &&
                    state.modelRepositoryState.localFolderSettings &&
                    state.modelRepositoryState.localFolderSettings.path) || null
        };
    });
};

export const getLocalFolderPath = (state: StateInterface) => {
    return state && state.modelRepositoryState && state.modelRepositoryState.localFolderSettings && state.modelRepositoryState.localFolderSettings.path;
};
