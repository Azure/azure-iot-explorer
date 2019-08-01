/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../shared/types/types';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { PRIVATE_REPO_CONNECTION_STRING_NAME, REPO_LOCATIONS } from '../constants/browserStorage';
import { MILLISECONDS_IN_MINUTE, PUBLIC_REPO_ENDPOINT } from '../constants/shared';
export const OFFSET_IN_MINUTES = 15;

export interface RepositoryLocationSettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    connectionString?: string;
}

export interface ApplicationStateInterface {
    showSettings: boolean;
    repositoryLocations: REPOSITORY_LOCATION_TYPE[];
    publicRepositorySettings?: PublicRepositorySettings;
    privateRepositorySettings?: PrivateRepositorySettings;
}

export interface PublicRepositorySettings {
    publicRepoHostName: string;
}

export interface PrivateRepositorySettings {
    privateConnectionString: string;
    privateRepoTimestamp: number;
    privateRepoToken: string;
}

export const applicationStateInitial =
    Record<ApplicationStateInterface>({
        privateRepositorySettings: {
            privateConnectionString: localStorage.getItem(PRIVATE_REPO_CONNECTION_STRING_NAME) || '',
            privateRepoTimestamp: new Date().getTime() - (OFFSET_IN_MINUTES * MILLISECONDS_IN_MINUTE),
            privateRepoToken: ''
            },
        publicRepositorySettings: {
            publicRepoHostName: PUBLIC_REPO_ENDPOINT
            },
        repositoryLocations: localStorage.getItem(REPO_LOCATIONS) ?
            localStorage.getItem(REPO_LOCATIONS).split(',').map(location => location as REPOSITORY_LOCATION_TYPE) :
            [REPOSITORY_LOCATION_TYPE.Public, REPOSITORY_LOCATION_TYPE.Device],
        showSettings: false,
    });

export type ApplicationStateType = IM<ApplicationStateInterface>;
