/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchModuleIdentities, addModuleIdentity, fetchModuleIdentityTwin, fetchModuleIdentity } from '../../../api/services/moduleService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { getModuleIdentitiesAction, addModuleIdentityAction, GetModuleIdentityTwinActionParameters, getModuleIdentityTwinAction, GetModuleIdentityActionParameters, getModuleIdentityAction } from '../actions';
import { ModuleIdentity } from './../../../api/models/moduleIdentity';

export function* getModuleIdentitiesSaga(action: Action<string>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
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
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
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

export function* getModuleIdentityTwinSaga(action: Action<GetModuleIdentityTwinActionParameters>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            deviceId: action.payload.deviceId,
            moduleId: action.payload.moduleId
        };

        const moduleIdentityTwin = yield call(fetchModuleIdentityTwin, parameters);

        yield put(getModuleIdentityTwinAction.done({params: action.payload, result: moduleIdentityTwin}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.getModuleIdentityTwinOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId,
                },
            },
            type: NotificationType.error
          }));

        yield put(getModuleIdentityTwinAction.failed({params: action.payload, error}));
    }
}

export function* getModuleIdentitySaga(action: Action<GetModuleIdentityActionParameters>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            deviceId: action.payload.deviceId,
            moduleId: action.payload.moduleId
        };

        const moduleIdentity = yield call(fetchModuleIdentity, parameters);

        yield put(getModuleIdentityAction.done({params: action.payload, result: moduleIdentity}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.getModuleIdentityOnError,
                translationOptions: {
                    error,
                    moduleId: action.payload.moduleId,
                },
            },
            type: NotificationType.error
          }));

        yield put(getModuleIdentityAction.failed({params: action.payload, error}));
    }
}
