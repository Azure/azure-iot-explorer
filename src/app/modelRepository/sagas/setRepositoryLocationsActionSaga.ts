/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../../constants/browserStorage';
import { RepositoryLocationSettings } from '../state';
import { addNotificationAction } from '../../notifications/actions';
import { getLocalFolderPath, getRepositoryLocationTypes } from '../reducer';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';

export function* setRepositoryLocationsSaga(action: Action<RepositoryLocationSettings[]>) {
    const localFolderPath = yield call(getLocalFolderPath, action.payload);
    yield call(setLocalFolderPath, localFolderPath);

    const locations = yield call(getRepositoryLocationTypes, action.payload);
    yield call(setRepositoryLocations, locations);

    yield put(addNotificationAction.started({
        text: {
            translationKey: ResourceKeys.notifications.modelRepoistorySettingsUpdated
        },
        type: NotificationType.success
    }));
}

export const setLocalFolderPath = (localFolderPath: string) => {
    localStorage.setItem(LOCAL_FILE_EXPLORER_PATH_NAME, localFolderPath);
};

export const setRepositoryLocations = (locations: REPOSITORY_LOCATION_TYPE[]) => {
    localStorage.setItem(REPO_LOCATIONS, locations.join(','));
};
