/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { GET_MODULE_IDENTITY_TWIN, UPDATE_MODULE_IDENTITY_TWIN } from '../../../constants/actionTypes';
import { getModuleIdentityTwinAction, updateModuleIdentityTwinAction } from './actions';
import { moduleTwinReducer } from './reducer';
import { moduleTwinStateInitial } from './state';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleTwin } from '../../../api/models/moduleTwin';

describe('moduleTwinReducer', () => {
    const deviceId = 'testDeviceId';
    const moduleId = 'testModule';

    const params = { deviceId, moduleId} ;
    const moduleTwin: ModuleTwin = {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: 0,
        connectionState: 'Disconnected',
        deviceEtag: 'AAAAAAAAAAE=',
        deviceId,
        etag: 'AAAAAAAAAAE=',
        lastActivityTime: '0001-01-01T00:00:00Z',
        moduleId,
        properties: {},
        status: 'enabled',
        statusUpdateTime: '0001-01-01T00:00:00Z',
        version: 1,
        x509Thumbprint:  {primaryThumbprint: null, secondaryThumbprint: null},
    };

    context(`${GET_MODULE_IDENTITY_TWIN}`, () => {
        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_START action`, () => {
            const action = getModuleIdentityTwinAction.started(params);
            expect(moduleTwinReducer(moduleTwinStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_DONE action`, () => {
            const action = getModuleIdentityTwinAction.done({params, result: moduleTwin});

            expect(moduleTwinReducer(moduleTwinStateInitial(), action).payload).toEqual(moduleTwin);
            expect(moduleTwinReducer(moduleTwinStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.fetched);
        });

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_FAILED action`, () => {
            const action = getModuleIdentityTwinAction.failed({error: -1, params: {
                deviceId,
                moduleId
            }});
            expect(moduleTwinReducer(moduleTwinStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });

    context(`${UPDATE_MODULE_IDENTITY_TWIN}`, () => {
        it (`handles ${UPDATE_MODULE_IDENTITY_TWIN}/ACTION_START action`, () => {
            const action = updateModuleIdentityTwinAction.started(moduleTwin);
            expect(moduleTwinReducer(moduleTwinStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${UPDATE_MODULE_IDENTITY_TWIN}/ACTION_DONE action`, () => {
            const action = updateModuleIdentityTwinAction.done({params: moduleTwin, result: moduleTwin});

            expect(moduleTwinReducer(moduleTwinStateInitial(), action).payload).toEqual(moduleTwin);
            expect(moduleTwinReducer(moduleTwinStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
        });

        it (`handles ${UPDATE_MODULE_IDENTITY_TWIN}/ACTION_FAILED action`, () => {
            const action = updateModuleIdentityTwinAction.failed({error: -1, params: moduleTwin});
            expect(moduleTwinReducer(moduleTwinStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
