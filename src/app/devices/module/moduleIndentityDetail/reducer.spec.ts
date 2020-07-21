/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { GET_MODULE_IDENTITY, DELETE_MODULE_IDENTITY } from '../../../constants/actionTypes';
import { getModuleIdentityAction, deleteModuleIdentityAction } from './actions';
import { moduleIdentityDetailReducer } from './reducer';
import { moduleIdentityDetailStateInterfaceInitial } from './state';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';

describe('moduleIdentityDetailReducer', () => {
    const deviceId = 'testDeviceId';
    const moduleId = 'testModule';
    const params = { deviceId, moduleId };
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        ...params
    };

    context(`${GET_MODULE_IDENTITY}`, () => {
        it (`handles ${GET_MODULE_IDENTITY}/ACTION_START action`, () => {
            const action = getModuleIdentityAction.started(params);
            expect(moduleIdentityDetailReducer(moduleIdentityDetailStateInterfaceInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_MODULE_IDENTITY}/ACTION_DONE action`, () => {
            const action = getModuleIdentityAction.done({params, result: moduleIdentity});
            const updatedState = moduleIdentityDetailReducer(moduleIdentityDetailStateInterfaceInitial(), action);
            expect(updatedState.payload).toEqual(moduleIdentity);
            expect(updatedState.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
        });

        it (`handles ${GET_MODULE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = getModuleIdentityAction.failed({error: -1, params });
            expect(moduleIdentityDetailReducer(moduleIdentityDetailStateInterfaceInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });

    context(`${DELETE_MODULE_IDENTITY}`, () => {
        let initialState = moduleIdentityDetailStateInterfaceInitial();
        initialState = initialState.merge({
            payload: moduleIdentity,
            synchronizationStatus: SynchronizationStatus.fetched
        });

        it (`handles ${DELETE_MODULE_IDENTITY}/ACTION_START action`, () => {
            const action = deleteModuleIdentityAction.started(params);
            expect(moduleIdentityDetailReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${DELETE_MODULE_IDENTITY}/ACTION_DONE action`, () => {
            const action = deleteModuleIdentityAction.done({params });
            expect(moduleIdentityDetailReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.deleted);
        });

        it (`handles ${DELETE_MODULE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = deleteModuleIdentityAction.failed({error: -1, params});
            expect(moduleIdentityDetailReducer(initialState, action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
