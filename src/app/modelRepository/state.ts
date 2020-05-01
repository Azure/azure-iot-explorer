/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../constants/browserStorage';
import { appConfig, HostMode } from '../../appConfig/appConfig';
import { PUBLIC_REPO_HOSTNAME } from '../constants/apiConstants';

export interface RepositoryLocationSettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    value?: string;
}

export interface PublicRepositorySettings {
    publicRepoHostName: string;
}

export interface LocalFolderSettings {
    path: string;
}

export interface ModelRepositoryStateInterface {
    repositoryLocations: REPOSITORY_LOCATION_TYPE[];
    publicRepositorySettings: PublicRepositorySettings;
    localFolderSettings: LocalFolderSettings;
}

export const modelRepositoryStateInitial = () => {
    return {
        localFolderSettings: appConfig.hostMode === HostMode.Electron ?  { path: localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME) || ''} : null,
        publicRepositorySettings: { publicRepoHostName: PUBLIC_REPO_HOSTNAME },
        repositoryLocations: localStorage.getItem(REPO_LOCATIONS) ?
                localStorage.getItem(REPO_LOCATIONS).split(',')
                    .filter(location => Object.values(REPOSITORY_LOCATION_TYPE).indexOf(location.toUpperCase() as REPOSITORY_LOCATION_TYPE) > -1)
                    .map(location => location.toUpperCase() as REPOSITORY_LOCATION_TYPE) :
                [REPOSITORY_LOCATION_TYPE.Public, REPOSITORY_LOCATION_TYPE.Device]
    };
};
