/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { fetchModuleIdentity } from '../../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { NotificationType } from '../../../../api/models/notification';
import { FetchModuleIdentityParameters } from '../../../../api/parameters/moduleParameters';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getModuleIdentityAction } from '../actions';

export function* getModuleIdentitySaga(action: Action<FetchModuleIdentityParameters>): SagaIterator {
    try {

        const moduleIdentity = yield call(fetchModuleIdentity, action.payload);

        yield put(getModuleIdentityAction.done({params: action.payload, result: moduleIdentity}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.getModuleIdentityOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId,
                },
            },
            type: NotificationType.error
          });

        yield put(getModuleIdentityAction.failed({params: action.payload, error}));
    }
}
