/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { addModuleIdentity } from '../../../api/services/moduleService';
import { AddModuleIdentityParameters } from '../../../api/parameters/moduleParameters';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { addModuleIdentityAction } from './actions';

export function* addModuleIdentitySagaWorker(action: Action<AddModuleIdentityParameters>): SagaIterator {
    try {
        const parameters = {
            moduleIdentity: action.payload,
        };

        const moduleIdentity = yield call(addModuleIdentity, action.payload);

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.addModuleIdentityOnSucceed,
                translationOptions: {
                    moduleId: action.payload.moduleIdentity.moduleId
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
                    moduleId: action.payload.moduleIdentity.moduleId
                },
            },
            type: NotificationType.error
          });

        yield put(addModuleIdentityAction.failed({params: action.payload, error}));
    }
}

export function* addModuleIdentitySaga() {
    yield takeEvery(addModuleIdentityAction.started.type, addModuleIdentitySagaWorker);
}
