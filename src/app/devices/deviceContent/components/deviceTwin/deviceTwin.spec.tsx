/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import DeviceTwin, { DeviceTwinDataProps, DeviceTwinDispatchProps } from './deviceTwin';
import { testSnapshot } from '../../../../shared/utils/testHelpers';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const pathname = `/`;

const location: any = { // tslint:disable-line:no-any
    pathname
};
const routerprops: any = { // tslint:disable-line:no-any
    history: {
        location
    },
    location,
    match: {}
};

const deviceContentProps: DeviceTwinDataProps = {
    twin: undefined,
    twinState: SynchronizationStatus.working
};

const mockGetDeviceTwin = jest.fn();
const deviceContentDispatchProps: DeviceTwinDispatchProps = {
    getDeviceTwin: mockGetDeviceTwin,
    refreshDigitalTwin: jest.fn(),
    updateDeviceTwin: jest.fn()
};

const getComponent = (overrides = {}) => {
    const props = {
        ...deviceContentProps,
        ...deviceContentDispatchProps,
        ...routerprops,
        ...overrides
    };
    return <DeviceTwin {...props} />;
};

describe('devices/components/deviceTwin', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            testSnapshot(getComponent());
        });

        it('matches snapshot with twin', () => {
            testSnapshot(getComponent({
                twin: {
                    deviceId: 'testId',
                    // tslint:disable-next-line:object-literal-sort-keys
                    deviceEtag: '',
                    etag: 'AAAAAAAAAAE=',
                    status: 'enabled',
                    statusUpdateTime: '0001-01-01T00:00:00Z',
                    connectionState: 'Disconnected',
                    lastActivityTime: '0001-01-01T00:00:00Z',
                    cloudToDeviceMessageCount: 0,
                    authenticationType: 'sas',
                    x509Thumbprint: {primaryThumbprint: null, secondaryThumbprint: null},
                    properties: {},
                    capabilities: {iotEdge: false},
                    version: 1
                },
                twinState: SynchronizationStatus.fetched
            }));
        });
    });
});
