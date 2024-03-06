/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { fetchModuleIdentityTwin } from '../../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { NotificationType } from '../../../../api/models/notification';
import { ModuleIdentityTwinParameters } from '../../../../api/parameters/moduleParameters';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getModuleIdentityTwinAction } from '../actions';

export function* getModuleIdentityTwinSaga(action: Action<ModuleIdentityTwinParameters>): SagaIterator {
    try {
        const moduleIdentityTwin = yield call(fetchModuleIdentityTwin, action.payload);

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
