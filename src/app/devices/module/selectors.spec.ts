/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import {
    getModuleIdentityListWrapperSelector,
    getModuleIdentityTwinWrapperSelector,
    getModuleIdentityWrapperSelector,
    getModuleIdentityListSyncStatusSelector
} from './selectors';
import { getInitialState } from './../../api/shared/testHelper';
import { ModuleTwin } from '../../api/models/moduleTwin';
import { ModuleIdentity } from './../../api/models/moduleIdentity';

describe('getModuleSelector', () => {
    const state = getInitialState();
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        deviceId: 'testDevice',
        moduleId: 'testModule'
    };
    /* tslint:disable */
    const moduleIdentityTwin: ModuleTwin = {
        deviceId: 'deviceId',
        moduleId: 'moduleId',
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
    }
    /* tslint:enable */
    state.moduleState = Record({
        moduleIdentity : {
            payload: moduleIdentity,
            synchronizationStatus: SynchronizationStatus.working
        },
        moduleIdentityList: {
            payload: [moduleIdentity],
            synchronizationStatus: SynchronizationStatus.working
        },
        moduleIdentityTwin: {
            payload: moduleIdentityTwin,
            synchronizationStatus: SynchronizationStatus.working
        }
    })();

    it('returns module identity list wrapper', () => {
        expect(getModuleIdentityListWrapperSelector(state)).toEqual({
            payload: [{
                authentication: null,
                deviceId: 'testDevice',
                moduleId: 'testModule'
            }],
            synchronizationStatus: SynchronizationStatus.working
        });
    });

    it('returns module twin wrapper', () => {
        expect(getModuleIdentityTwinWrapperSelector(state)).toEqual({
            payload: moduleIdentityTwin,
            synchronizationStatus: SynchronizationStatus.working
        });
    });

    it('returns module twin', () => {
        expect(getModuleIdentityWrapperSelector(state)).toEqual({
            payload: moduleIdentity,
            synchronizationStatus: SynchronizationStatus.working
        });
    });

    it('returns module list sync status', () => {
        expect(getModuleIdentityListSyncStatusSelector(state)).toEqual(SynchronizationStatus.working);
    });
});
