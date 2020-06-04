/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import {  deleteModuleIdentity } from '../../../../api/services/moduleService';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { NotificationType } from '../../../../api/models/notification';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { DeleteModuleIdentityActionParameters, deleteModuleIdentityAction } from '../actions';

export function* deleteModuleIdentitySaga(action: Action<DeleteModuleIdentityActionParameters>) {
    try {
        const parameters = {
            deviceId: action.payload.deviceId,
            moduleId: action.payload.moduleId
        };

        yield call(deleteModuleIdentity, parameters);

        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.deleteModuleIdentityOnSuccess,
                translationOptions: {
                    moduleId: action.payload.moduleId
                },
            },
            type: NotificationType.success
        });
        yield put(deleteModuleIdentityAction.done({params: action.payload}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.deleteModuleIdentityOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId,
                },
            },
            type: NotificationType.error
        });

        yield put(deleteModuleIdentityAction.failed({params: action.payload, error}));
    }
}
