/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../shared/types/types';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../constants/browserStorage';
import { appConfig, HostMode } from '../../appConfig/appConfig';

export interface RepositoryLocationSettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    value?: string;
}

export interface ApplicationStateInterface {
    showSettings: boolean;
    repositoryLocations: REPOSITORY_LOCATION_TYPE[];
    localFolderSettings: LocalFolderSettings;
}

export interface LocalFolderSettings {
    path: string;
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
    return [REPOSITORY_LOCATION_TYPE.Public];
};

export const applicationStateInitial =
    Record<ApplicationStateInterface>({
        localFolderSettings: appConfig.hostMode === HostMode.Electron ?
            {
                path: localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME) || '',
            } : null,
        repositoryLocations: getRepositoryLocations(),
        showSettings: false
    });

export type ApplicationStateType = IM<ApplicationStateInterface>;
