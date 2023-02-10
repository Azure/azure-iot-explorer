/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { setRepositoryConfigurations } from '../../../api/services/modelRepositoryService';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { setRepositoryLocationsAction } from '../actions';
import { ModelRepositoryStateInterface } from '../state';

export function* setRepositoryLocationsSaga(action: Action<ModelRepositoryStateInterface>): SagaIterator {
    yield call(setRepositoryConfigurations, action.payload);

    yield call(raiseNotificationToast, {
        text: {
            translationKey: ResourceKeys.notifications.modelRepositorySettingsUpdated
        },
        type: NotificationType.success
    });

    yield put(setRepositoryLocationsAction.done({params: action.payload, result: action.payload}));
}
