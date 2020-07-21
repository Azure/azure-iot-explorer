/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeLatest } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchModuleIdentityTwin } from '../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { GetModuleIdentityTwinActionParameters, getModuleIdentityTwinAction } from './actions';

export function* getModuleIdentityTwinSagaWorker(action: Action<GetModuleIdentityTwinActionParameters>) {
    try {
        const parameters = {
            deviceId: action.payload.deviceId,
            moduleId: action.payload.moduleId
        };

        const moduleIdentityTwin = yield call(fetchModuleIdentityTwin, parameters);

        yield put(getModuleIdentityTwinAction.done({params: action.payload, result: moduleIdentityTwin}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.getModuleIdentityTwinOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId,
                },
            },
            type: NotificationType.error
          });

        yield put(getModuleIdentityTwinAction.failed({params: action.payload, error}));
    }
}

export function* getModuleIdentityTwinSaga() {
    yield takeLatest(getModuleIdentityTwinAction.started.type, getModuleIdentityTwinSagaWorker);
}
