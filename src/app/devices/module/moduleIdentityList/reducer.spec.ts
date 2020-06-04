/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { GET_MODULE_IDENTITIES } from '../../../constants/actionTypes';
import { getModuleIdentitiesAction } from './actions';
import { moduleIdentityListReducer } from './reducer';
import { moduleIndentityListStateInitial } from './state';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';

describe('moduleStateReducer', () => {
    const deviceId = 'testDeviceId';
    const moduleId = 'testModule';
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        deviceId,
        moduleId
    };

    context(`${GET_MODULE_IDENTITIES}`, () => {
        it (`handles ${GET_MODULE_IDENTITIES}/ACTION_START action`, () => {
            const action = getModuleIdentitiesAction.started(deviceId);
            expect(moduleIdentityListReducer(moduleIndentityListStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_MODULE_IDENTITIES}/ACTION_DONE action`, () => {
            const action = getModuleIdentitiesAction.done({params: deviceId, result: [moduleIdentity]});
            const updatedState = moduleIdentityListReducer(moduleIndentityListStateInitial(), action);
            expect(updatedState.payload).toEqual([moduleIdentity]);
            expect(updatedState.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
        });

        it (`handles ${GET_MODULE_IDENTITIES}/ACTION_FAILED action`, () => {
            const action = getModuleIdentitiesAction.failed({error: -1, params: deviceId});
            expect(moduleIdentityListReducer(moduleIndentityListStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
