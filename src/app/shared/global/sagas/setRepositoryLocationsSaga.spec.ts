/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { setRepositoryLocationsSaga } from './setRepositoryLocationsSaga';
import { setRepositoryLocationsAction } from '../actions';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { setConfigurableRepositoryPath, setLocalFolderPath, setRepositoryLocations } from '../../../api/services/modelRepositoryService';
import { getConfigurableRepositoryPath, getLocalFolderPath, getRepositoryLocationTypes } from '../reducer';

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

    it('issues call effect getConfigurableRepositoryPath', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: false,
            value: call(getConfigurableRepositoryPath, [])
        });
    });

    it('issues call effect to setConfigurableRepositoryPath', () => {
        expect(setRepositoryLocationsSagaGenerator.next('devicemodeltest.azureedge.net')).toEqual({
            done: false,
            value: call(setConfigurableRepositoryPath, 'devicemodeltest.azureedge.net')
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

    it('issues notification', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.modelRepoistorySettingsUpdated
                },
                type: NotificationType.success
            })
        });
    });

    it('finishes', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: true,
        });
    });
});
