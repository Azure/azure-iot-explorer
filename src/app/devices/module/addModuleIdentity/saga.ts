/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeEvery, all } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { addModuleIdentity } from '../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { addModuleIdentityAction } from './actions';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { loggerSaga } from '../../../shared/appTelemetry/appTelemetrySaga';

export function* addModuleIdentitySagaWorker(action: Action<ModuleIdentity>) {
    try {
        const parameters = {
            moduleIdentity: action.payload,
        };

        const moduleIdentity = yield call(addModuleIdentity, parameters);

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.addModuleIdentityOnSucceed,
                translationOptions: {
                    moduleId: action.payload.moduleId
                },
            },
            type: NotificationType.success
        });

        yield put(addModuleIdentityAction.done({params: action.payload, result: moduleIdentity}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.addModuleIdentityOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId
                },
            },
            type: NotificationType.error
          });

        yield put(addModuleIdentityAction.failed({params: action.payload, error}));
    }
}

export function* addModuleIdentitySaga() {
    yield all([
        takeEvery(addModuleIdentityAction.started.type, addModuleIdentitySagaWorker),
        takeEvery('*', loggerSaga)
    ]);
}
