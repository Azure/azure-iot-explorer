/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { getDeviceTwinSelector, getDeviceTwinStateSelector } from './selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getInitialState } from '../../../../api/shared/testHelper';
import { Twin } from '../../../../api/models/device';

const twin: Twin = {
    authenticationType: 'sas',
    capabilities: null,
    cloudToDeviceMessageCount: 0,
    connectionState: 'Connected',
    deviceEtag: 'ODIwNTc2OTMy',
    deviceId: 'ying-device',
    etag: 'AAAAAAAAABY=',
    lastActivityTime: '2019-08-07T00:43:08.3953349Z',
    properties: {
        desired: {},
        reported: {},
    },
    status: 'enabled',
    statusUpdateTime: '0001-01-01T00:00:00Z',
    version: 1,
    x509Thumbprint: {
        primaryThumbprint: null,
        secondaryThumbprint: null
    },
};

describe('./selectors', () => {
    const state = getInitialState();

    state.deviceContentState = Record({
        componentNameSelected: '',
        deviceIdentity: null,
        digitalTwin:null,
        deviceTwin: {
            payload: twin,
            synchronizationStatus: SynchronizationStatus.fetched
        },
        digitalTwinInterfaceProperties: null,
        modelDefinitionWithSource: null
    })();

    it('returns deviceTwin', () => {
        expect(getDeviceTwinSelector(state)).toEqual(twin);
    });

    it('returns deviceTwin sync status', () => {
        expect(getDeviceTwinStateSelector(state)).toEqual(SynchronizationStatus.fetched);
    });
});
