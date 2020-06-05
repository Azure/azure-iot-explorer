/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import { getDeviceIdentityWrapperSelector } from './selectors';
import { getInitialState } from './../../api/shared/testHelper';
import { DeviceIdentity } from '../../api/models/deviceIdentity';

describe('selector', () => {
    const state = getInitialState();
    const deviceIdentity: DeviceIdentity = {
        authentication: {
            symmetricKey: {
                primaryKey: null,
                secondaryKey: null
            },
            type: 'sas',
            x509Thumbprint: {
                primaryThumbprint: null,
                secondaryThumbprint: null
            },
        },
        capabilities: {
            iotEdge: false
        },
        cloudToDeviceMessageCount: 0,
        deviceId: 'deviceId',
        etag: 'AAAAAAAAAAk=',
        lastActivityTime: '2019-04-22T22:49:58.4457783',
        status: 'enabled',
        statusReason: null,
        statusUpdatedTime: '0001-01-01T00:00:00',
    };

    state.deviceContentState = Record({
        deviceIdentity: {
            payload: deviceIdentity,
            synchronizationStatus: SynchronizationStatus.fetched
        }
    })();

    describe('device identity sync wrapper', () => {
        it('returns DeviceIdentityWrapper', () => {
            expect(getDeviceIdentityWrapperSelector(state)).toEqual({
                payload: deviceIdentity,
                synchronizationStatus: SynchronizationStatus.fetched
            });
        });
    });
});
