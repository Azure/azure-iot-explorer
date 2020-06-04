/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { ADD_MODULE_IDENTITY } from '../../../constants/actionTypes';
import { addModuleIdentityAction } from './actions';
import { addModuleIdentityReducer } from './reducer';
import { addModuleStateInitial } from './state';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';

describe('addModuleIdentityReducer', () => {
    const deviceId = 'testDeviceId';

    const moduleId = 'testModule';
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        deviceId,
        moduleId
    };

    context(`${ADD_MODULE_IDENTITY}`, () => {
        it (`handles ${ADD_MODULE_IDENTITY}/ACTION_START action`, () => {
            const action = addModuleIdentityAction.started(moduleIdentity);
            expect(addModuleIdentityReducer(addModuleStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${ADD_MODULE_IDENTITY}/ACTION_DONE action`, () => {
            const action = addModuleIdentityAction.done({params: moduleIdentity, result: moduleIdentity});
            expect(addModuleIdentityReducer(addModuleStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
        });

        it (`handles ${ADD_MODULE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = addModuleIdentityAction.failed({error: -1, params: moduleIdentity});
            expect(addModuleIdentityReducer(addModuleStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
