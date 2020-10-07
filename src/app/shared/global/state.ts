/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../types/types';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getRepositoryLocations, getLocalFolderPath, getConfigurableRepositoryPath } from '../../api/services/modelRepositoryService';
import { Notification } from '../../api/models/notification';

export interface NotificationsStateInterface {
    hasNew: boolean;
    notifications: Notification[];
}

export interface RepositoryLocationSettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    value?: string;
}

export interface LocalFolderSettings {
    path: string;
}

export interface ConfigurableRepositorySettings {
    path: string;
}

export interface ModelRepositoryStateInterface {
    repositoryLocations: REPOSITORY_LOCATION_TYPE[];
    localFolderSettings: LocalFolderSettings;
    configurableRepositorySettings: LocalFolderSettings;
}

export interface GlobalStateInterface {
    modelRepositoryState: ModelRepositoryStateInterface;
    notificationsState: NotificationsStateInterface;
}

export type GlobalStateType = IM<GlobalStateInterface>;

export const globalStateInitial = Record<GlobalStateInterface>({
    modelRepositoryState: {
        configurableRepositorySettings: {
            path: getConfigurableRepositoryPath()
        },
        localFolderSettings: {
            path: getLocalFolderPath()
        },
        repositoryLocations: getRepositoryLocations(),
    },
    notificationsState: {
        hasNew: false,
        notifications: []
    }
});
