/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { getRepositoryLocations, getLocalFolderPath } from './services/modelRepositoryService';

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

export const modelRepositoryStateInitial = () => {
    return {
        localFolderSettings: {
            path: getLocalFolderPath()
        },
        repositoryLocations: getRepositoryLocations(),
    };
};
