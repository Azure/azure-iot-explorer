/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import {
    GET_MODULE_IDENTITIES,
    ADD_MODULE_IDENTITY,
    GET_MODULE_IDENTITY_TWIN
  } from '../../constants/actionTypes';
import {
    getModuleIdentitiesAction,
    addModuleIdentityAction,
    getModuleIdentityTwinAction
} from './actions';
import reducer from './reducer';
import { moduleStateInitial } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../api/models/moduleIdentity';
import { ModuleTwin } from '../../api/models/moduleTwin';

describe('moduleStateReducer', () => {
    const deviceId = 'testDeviceId';

    describe('moduleIdentities scenarios', () => {

        const moduleId = 'testModule';
        const moduleIdentity: ModuleIdentity = {
            authentication: null,
            deviceId,
            moduleId
        };

        // tslint:disable
        const moduleTwin: ModuleTwin = {
            deviceId,
            moduleId,
            etag: 'AAAAAAAAAAE=',
            deviceEtag: 'AAAAAAAAAAE=',
            status: 'enabled',
            statusUpdateTime: '0001-01-01T00:00:00Z',
            lastActivityTime: '0001-01-01T00:00:00Z',
            x509Thumbprint:  {primaryThumbprint: null, secondaryThumbprint: null},
            version: 1,
            connectionState: 'Disconnected',
            cloudToDeviceMessageCount: 0,
            authenticationType:'sas',
            properties: {}
        };
        // tslint:enable

        it (`handles ${GET_MODULE_IDENTITIES}/ACTION_START action`, () => {
            const action = getModuleIdentitiesAction.started(deviceId);
            expect(reducer(moduleStateInitial(), action).moduleIdentityList.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_MODULE_IDENTITIES}/ACTION_DONE action`, () => {
            const action = getModuleIdentitiesAction.done({params: deviceId, result: [moduleIdentity]});
            expect(reducer(moduleStateInitial(), action).moduleIdentityList).toEqual({
                moduleIdentities: [moduleIdentity],
                synchronizationStatus: SynchronizationStatus.fetched});
        });

        it (`handles ${GET_MODULE_IDENTITIES}/ACTION_FAILED action`, () => {
            const action = getModuleIdentitiesAction.failed({error: -1, params: deviceId});
            expect(reducer(moduleStateInitial(), action).moduleIdentityList.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        it (`handles ${ADD_MODULE_IDENTITY}/ACTION_START action`, () => {
            const action = addModuleIdentityAction.started(moduleIdentity);
            expect(reducer(moduleStateInitial(), action).moduleIdentityList.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${ADD_MODULE_IDENTITY}/ACTION_DONE action`, () => {
            const action = addModuleIdentityAction.done({params: moduleIdentity, result: moduleIdentity});
            expect(reducer(moduleStateInitial(), action).moduleIdentityList).toEqual({
                synchronizationStatus: SynchronizationStatus.upserted});
        });

        it (`handles ${ADD_MODULE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = addModuleIdentityAction.failed({error: -1, params: moduleIdentity});
            expect(reducer(moduleStateInitial(), action).moduleIdentityList.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_START action`, () => {
            const action = getModuleIdentityTwinAction.started({
                deviceId,
                moduleId
            });
            expect(reducer(moduleStateInitial(), action).moduleIdentityTwin.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_DONE action`, () => {
            const action = getModuleIdentityTwinAction.done({params: {
                deviceId,
                moduleId
            }, result: moduleTwin});
            expect(reducer(moduleStateInitial(), action).moduleIdentityTwin).toEqual({
                moduleIdentityTwin: moduleTwin,
                synchronizationStatus: SynchronizationStatus.fetched});
        });

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_FAILED action`, () => {
            const action = getModuleIdentityTwinAction.failed({error: -1, params: {
                deviceId,
                moduleId
            }});
            expect(reducer(moduleStateInitial(), action).moduleIdentityTwin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
