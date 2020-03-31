/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../shared/types/types';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { PRIVATE_REPO_CONNECTION_STRING_NAME, REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../constants/browserStorage';
import { MILLISECONDS_IN_MINUTE, PUBLIC_REPO_HOSTNAME } from '../constants/shared';
import { appConfig, HostMode } from '../../appConfig/appConfig';
export const OFFSET_IN_MINUTES = 15;

export interface RepositoryLocationSettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    value?: string;
}

export interface ApplicationStateInterface {
    showSettings: boolean;
    repositoryLocations: REPOSITORY_LOCATION_TYPE[];
    publicRepositorySettings: PublicRepositorySettings;
    privateRepositorySettings: PrivateRepositorySettings;
    localFolderSettings: LocalFolderSettings;
}

export interface PublicRepositorySettings {
    publicRepoHostName: string;
}

export interface PrivateRepositorySettings {
    privateConnectionString: string;
    privateRepoTimestamp: number;
    privateRepoToken: string;
}

export interface LocalFolderSettings {
    path: string;
}

export const applicationStateInitial = appConfig.hostMode === HostMode.Electron ?
    Record<ApplicationStateInterface>({
        localFolderSettings: {
            path: localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME) || '',
        },
        privateRepositorySettings: {
            privateConnectionString: localStorage.getItem(PRIVATE_REPO_CONNECTION_STRING_NAME) || '',
            privateRepoTimestamp: new Date().getTime() - (OFFSET_IN_MINUTES * MILLISECONDS_IN_MINUTE),
            privateRepoToken: ''
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
        privateRepositorySettings: {
            privateConnectionString: localStorage.getItem(PRIVATE_REPO_CONNECTION_STRING_NAME) || '',
            privateRepoTimestamp: new Date().getTime() - (OFFSET_IN_MINUTES * MILLISECONDS_IN_MINUTE),
            privateRepoToken: ''
        },
        publicRepositorySettings: {
            publicRepoHostName: PUBLIC_REPO_HOSTNAME
        },
        repositoryLocations: localStorage.getItem(REPO_LOCATIONS) ?
            localStorage.getItem(REPO_LOCATIONS).split(',').map(location => location as REPOSITORY_LOCATION_TYPE).filter(location => location !== REPOSITORY_LOCATION_TYPE.Local) :
            [REPOSITORY_LOCATION_TYPE.Public, REPOSITORY_LOCATION_TYPE.Device],
        showSettings: false
    });

export type ApplicationStateType = IM<ApplicationStateInterface>;
