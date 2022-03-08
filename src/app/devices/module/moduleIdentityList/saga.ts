/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { fetchModuleIdentities } from '../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getModuleIdentitiesAction } from './actions';

export function* getModuleIdentitiesSagaWorker(action: Action<string>): SagaIterator {
    try {
        const parameters = {
            deviceId: action.payload
        };

        const moduleIdentities = yield call(fetchModuleIdentities, parameters);

        yield put(getModuleIdentitiesAction.done({params: action.payload, result: moduleIdentities}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.getModuleIdentitiesOnError,
                translationOptions: {
                    deviceId: action.payload,
                    error,
                },
            },
            type: NotificationType.error
          });

        yield put(getModuleIdentitiesAction.failed({params: action.payload, error}));
    }
}

export function* getModuleIdentitiesSaga() {
    yield takeLatest(getModuleIdentitiesAction.started.type, getModuleIdentitiesSagaWorker);
}
