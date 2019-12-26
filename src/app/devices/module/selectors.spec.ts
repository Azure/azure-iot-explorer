/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import {
    getModuleIdentityListWrapperSelector,
    getModuleIdentityTwinWrapperSelector
} from './selectors';
import { getInitialState } from './../../api/shared/testHelper';
import { ModuleTwin } from '../../api/models/moduleTwin';

describe('getModuleSelector', () => {
    const state = getInitialState();
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
        moduleIdentityList: {
            moduleIdentities: [{
                    authentication: null,
                    deviceId: 'testDevice',
                    moduleId: 'testModule'
                }],
            synchronizationStatus: SynchronizationStatus.working
        },
        moduleIdentityTwin: {
            moduleIdentityTwin,
            synchronizationStatus: SynchronizationStatus.working
        }
    })();

    it('returns module identity list wrapper', () => {
        expect(getModuleIdentityListWrapperSelector(state)).toEqual({
            moduleIdentities: [{
                authentication: null,
                deviceId: 'testDevice',
                moduleId: 'testModule'
            }],
            synchronizationStatus: SynchronizationStatus.working
        });
    });

    it('returns module twin wrapper', () => {
        expect(getModuleIdentityTwinWrapperSelector(state)).toEqual({
            moduleIdentityTwin,
            synchronizationStatus: SynchronizationStatus.working
        });
    });
});
