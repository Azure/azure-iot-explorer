/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils'; // tslint:disable-line: no-implicit-dependencies
import { setRepositoryLocationsSaga } from './setRepositoryLocationsSaga';
import { setRepositoryLocationsAction } from '../actions';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { setRepositoryConfigurations } from '../../../api/services/modelRepositoryService';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';

describe('setRepositoryLocationsSaga', () => {
    const params = [
        {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'folder'},
        {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable, value: 'devicemodeltest.azureedge.net'}
    ];
    const setRepositoryLocationsSagaGenerator = cloneableGenerator(setRepositoryLocationsSaga)(setRepositoryLocationsAction.started(params));

    it('issues call effect to setRepositoryConfigurations', () => {
        expect(setRepositoryLocationsSagaGenerator.next([])).toEqual({
            done: false,
            value: call(setRepositoryConfigurations, params)
        });
    });

    it('issues notification', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.modelRepositorySettingsUpdated
                },
                type: NotificationType.success
            })
        });
    });

    it('issues call effect to setRepositoryLocation', () => {
        expect(setRepositoryLocationsSagaGenerator.next([])).toEqual({
            done: false,
            value: put(setRepositoryLocationsAction.done({params, result: params}))
        });
    });

    it('finishes', () => {
        expect(setRepositoryLocationsSagaGenerator.next()).toEqual({
            done: true,
        });
    });
});
