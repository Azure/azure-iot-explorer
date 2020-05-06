/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../constants/browserStorage';
import { appConfig, HostMode } from '../../appConfig/appConfig';

export interface RepositoryLocationSettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    value?: string;
}

export interface LocalFolderSettings {
    path: string;
}

export interface ModelRepositoryStateInterface {
    repositoryLocations: REPOSITORY_LOCATION_TYPE[];
    localFolderSettings: LocalFolderSettings;
}

const getRepositoryLocations = () => {
    if (localStorage.getItem(REPO_LOCATIONS)) {
        let locations = localStorage.getItem(REPO_LOCATIONS).split(',')
            .filter(location => Object.values(REPOSITORY_LOCATION_TYPE).indexOf(location.toUpperCase() as REPOSITORY_LOCATION_TYPE) > -1)
            .map(location => location.toUpperCase() as REPOSITORY_LOCATION_TYPE);

        if (appConfig.hostMode !== HostMode.Electron) { // do now show local folder option in browser version
            locations = locations.filter(location => location !== REPOSITORY_LOCATION_TYPE.Local);
        }
        return locations;
    }
    return [];
};

export const modelRepositoryStateInitial = () => {
    return {
        localFolderSettings: appConfig.hostMode === HostMode.Electron ?
        {
            path: localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME) || '',
        } : null,
        repositoryLocations: getRepositoryLocations(),
    };
};
