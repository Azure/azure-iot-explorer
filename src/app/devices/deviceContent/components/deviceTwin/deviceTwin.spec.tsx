/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import DeviceTwin, { DeviceTwinDataProps, DeviceTwinDispatchProps } from './deviceTwin';
import { testSnapshot, mountWithLocalization } from '../../../../shared/utils/testHelpers';
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

const devicTwinDataProps: DeviceTwinDataProps = {
    twin: undefined,
    twinState: SynchronizationStatus.working
};

const mockGetDeviceTwin = jest.fn();
const mockUpdateDeviceTwin = jest.fn();
const deviceTwinDispatchProps: DeviceTwinDispatchProps = {
    getDeviceTwin: mockGetDeviceTwin,
    refreshDigitalTwin: jest.fn(),
    updateDeviceTwin: mockUpdateDeviceTwin
};

const getComponent = (overrides = {}) => {
    const props = {
        ...devicTwinDataProps,
        ...deviceTwinDispatchProps,
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

        it('calls refresh and save', () => {
            const wrapper = mountWithLocalization(getComponent());
            let commandBar = wrapper.find(CommandBar).first();
            commandBar.props().items[0].onClick(null);
            expect(mockGetDeviceTwin).toBeCalled();

            const deviceTwin = wrapper.find(DeviceTwin);
            deviceTwin.setState({isDirty: true, twin: 123});
            wrapper.update();

            commandBar = wrapper.find(CommandBar).first();
            commandBar.props().items[1].onClick(null);
            wrapper.update();
            expect(mockUpdateDeviceTwin).toBeCalled();
        });
    });
});
