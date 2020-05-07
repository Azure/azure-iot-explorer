/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setRepositoryLocationsSaga, setLocalFolderPath, setRepositoryLocations } from './setRepositoryLocationsSaga';
import { setRepositoryLocationsAction } from '../actions';
import { REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../../constants/browserStorage';
import { addNotificationAction } from '../../notifications/actions';
import { getLocalFolderPath, getRepositoryLocationTypes } from '../reducer';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('setRepositoryLocationsSaga', () => {
    const setRepositoryLocationsSagaGenerator = cloneableGenerator(setRepositoryLocationsSaga)(setRepositoryLocationsAction([]));

    it('issues call effect getLocalFolderPath', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: false,
            value: call(getLocalFolderPath, [])
        });
    });

    it('issues call effect to setLocalFolderPath', () => {
        expect(setRepositoryLocationsSagaGenerator.next('folder')).toEqual({
            done: false,
            value: call(setLocalFolderPath, 'folder')
        });
    });

    it('issues call effect to getRepositoryLocationTypes', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: false,
            value: call(getRepositoryLocationTypes, [])
        });
    });

    it('issues call effect to setRepositoryLocation', () => {
        expect(setRepositoryLocationsSagaGenerator.next([])).toEqual({
            done: false,
            value: call(setRepositoryLocations, [])
        });
    });

    it('issues addNOtificationAction.started', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: false,
            value: put(addNotificationAction.started({
                text: {
                    translationKey: ResourceKeys.notifications.modelRepoistorySettingsUpdated
                },
                type: NotificationType.success
            }))
        });
    });

    it('finishes', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: true,
        });
    });
});

describe('setLocalFolderPath', () => {
    setLocalFolderPath('localFolderPath');
    expect(localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME)).toEqual('localFolderPath');

});

describe('setRepositoryLocations', () => {
    setRepositoryLocations([
      REPOSITORY_LOCATION_TYPE.Local,
      REPOSITORY_LOCATION_TYPE.Public
    ]);

    expect(localStorage.getItem(REPO_LOCATIONS)).toEqual('LOCAL,PUBLIC');
});
