
/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchModuleIdentities, addModuleIdentity } from '../../../api/services/devicesService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getConnectionStringSelector } from '../../../login/selectors';
import { getModuleIdentitiesAction, addModuleIdentityAction } from '../actions';
import { ModuleIdentity } from './../../../api/models/moduleIdentity';

export function* getModuleIdentitiesSaga(action: Action<string>) {
    try {
        const parameters = {
            connectionString: yield select(getConnectionStringSelector),
            deviceId: action.payload,
        };

        const moduleIdentities = yield call(fetchModuleIdentities, parameters);

        yield put(getModuleIdentitiesAction.done({params: action.payload, result: moduleIdentities}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.getModuleIdentitiesOnError,
                translationOptions: {
                    deviceId: action.payload,
                    error,
                },
            },
            type: NotificationType.error
          }));

        yield put(getModuleIdentitiesAction.failed({params: action.payload, error}));
    }
}

export function* addModuleIdentitySaga(action: Action<ModuleIdentity>) {
    try {
        const parameters = {
            connectionString: yield select(getConnectionStringSelector),
            moduleIdentity: action.payload,
        };

        const moduleIdentity = yield call(addModuleIdentity, parameters);

        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.addModuleIdentityOnSucceed,
                translationOptions: {
                    moduleId: action.payload.moduleId
                },
            },
            type: NotificationType.success
        }));

        yield put(addModuleIdentityAction.done({params: action.payload, result: moduleIdentity}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.addModuleIdentityOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId
                },
            },
            type: NotificationType.error
          }));

        yield put(addModuleIdentityAction.failed({params: action.payload, error}));
    }
}
