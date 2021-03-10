/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { updateModuleIdentityTwin } from '../../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { NotificationType } from '../../../../api/models/notification';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { updateModuleIdentityTwinAction } from '../actions';
import { ModuleTwin } from '../../../../api/models/moduleTwin';

export function* updateModuleIdentityTwinSaga(action: Action<ModuleTwin>) {
    try {
        const moduleIdentityTwin = yield call(updateModuleIdentityTwin, action.payload);

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateModuleIdentityTwinOnSuccess,
                translationOptions: {
                    moduleId: action.payload.moduleId
                },
            },
            type: NotificationType.success
          });

        yield put(updateModuleIdentityTwinAction.done({params: action.payload, result: moduleIdentityTwin}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateModuleIdentityTwinOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId,
                },
            },
            type: NotificationType.error
          });

        yield put(updateModuleIdentityTwinAction.failed({params: action.payload, error}));
    }
}
