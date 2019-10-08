/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateType } from '../shared/redux/state';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { Theme } from '../../themer';

export const getSettingsVisibleSelector = (state: StateType) => {
    return state && state.applicationState && state.applicationState.showSettings;
};

export const getRepositoryLocationSettingsSelector = (state: StateType) => {
    return state && state.applicationState && state.applicationState.repositoryLocations && state.applicationState.repositoryLocations.map(item => {
        return {
            connectionString: item === REPOSITORY_LOCATION_TYPE.Private &&
                state.applicationState.privateRepositorySettings &&
                state.applicationState.privateRepositorySettings.privateConnectionString,
            repositoryLocationType: item
        };
    });
};

export const getPrivateRepositorySettingsSelector = (state: StateType) => {
    return state && state.applicationState.privateRepositorySettings;
};

export const getPublicRepositoryHostName = (state: StateType) => {
    return state && state.applicationState && state.applicationState.publicRepositorySettings && state.applicationState.publicRepositorySettings.publicRepoHostName;
};

export const getApplicationThemeSelector = (state: StateType) => {
    return state && state.applicationState && state.applicationState.theme || Theme.dark;
};
