/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../shared/types/types';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../constants/browserStorage';
import { appConfig, HostMode } from '../../appConfig/appConfig';
import { PUBLIC_REPO_HOSTNAME } from '../constants/apiConstants';

export interface RepositoryLocationSettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    value?: string;
}

export interface ApplicationStateInterface {
    showSettings: boolean;
    repositoryLocations: REPOSITORY_LOCATION_TYPE[];
    publicRepositorySettings: PublicRepositorySettings;
    localFolderSettings: LocalFolderSettings;
}

export interface PublicRepositorySettings {
    publicRepoHostName: string;
}

export interface LocalFolderSettings {
    path: string;
}

export const applicationStateInitial = appConfig.hostMode === HostMode.Electron ?
    Record<ApplicationStateInterface>({
        localFolderSettings: {
            path: localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME) || '',
        },
        publicRepositorySettings: {
            publicRepoHostName: PUBLIC_REPO_HOSTNAME
        },
        repositoryLocations: localStorage.getItem(REPO_LOCATIONS) ?
            localStorage.getItem(REPO_LOCATIONS).split(',').map(location => location as REPOSITORY_LOCATION_TYPE) :
            [REPOSITORY_LOCATION_TYPE.Public, REPOSITORY_LOCATION_TYPE.Device],
        showSettings: false
    }) :
    Record<ApplicationStateInterface>({
        localFolderSettings: null,
        publicRepositorySettings: {
            publicRepoHostName: PUBLIC_REPO_HOSTNAME
        },
        repositoryLocations: localStorage.getItem(REPO_LOCATIONS) ?
            localStorage.getItem(REPO_LOCATIONS).split(',').map(location => location as REPOSITORY_LOCATION_TYPE).filter(location => location !== REPOSITORY_LOCATION_TYPE.Local) :
            [REPOSITORY_LOCATION_TYPE.Public, REPOSITORY_LOCATION_TYPE.Device],
        showSettings: false
    });

export type ApplicationStateType = IM<ApplicationStateInterface>;
