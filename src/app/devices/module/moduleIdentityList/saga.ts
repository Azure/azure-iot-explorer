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
import { FetchModuleIdentitiesParameters } from '../../../api/parameters/moduleParameters';

export function* getModuleIdentitiesSagaWorker(action: Action<FetchModuleIdentitiesParameters>): SagaIterator {
    try {
        const moduleIdentities = yield call(fetchModuleIdentities, action.payload);

        yield put(getModuleIdentitiesAction.done({params: action.payload, result: moduleIdentities}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.getModuleIdentitiesOnError,
                translationOptions: {
                    deviceId: action.payload.deviceId,
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
