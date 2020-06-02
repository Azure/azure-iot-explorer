/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DeviceTwin, DeviceTwinDataProps, DeviceTwinDispatchProps } from './deviceTwin';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: '?deviceId=test' }),
}));

const devicTwinDataProps: DeviceTwinDataProps = {
    twin: undefined,
    twinState: SynchronizationStatus.working
};

const mockGetDeviceTwin = jest.fn();
const mockUpdateDeviceTwin = jest.fn();
const deviceTwinDispatchProps: DeviceTwinDispatchProps = {
    getDeviceTwin: mockGetDeviceTwin,
    updateDeviceTwin: mockUpdateDeviceTwin
};

const getComponent = (overrides = {}) => {
    const props = {
        ...devicTwinDataProps,
        ...deviceTwinDispatchProps,
        ...overrides
    };
    return <DeviceTwin {...props} />;
};

describe('devices/components/deviceTwin', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });

        it('matches snapshot with twin', () => {
            expect(shallow(getComponent({
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
            }))).toMatchSnapshot();
        });

        it('calls refresh and save', () => {
            const realUseState = React.useState;
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState({
                isDirty: true,
                isTwinValid: true,
                needsRefresh: false,
                twin: 123
            }));

            const wrapper = mount(getComponent());
            let commandBar = wrapper.find(CommandBar).first();
            act(() => commandBar.props().items[0].onClick(null));
            expect(mockGetDeviceTwin).toBeCalled();

            commandBar = wrapper.find(CommandBar).first();
            act(() => commandBar.props().items[1].onClick(null));
            wrapper.update();
            expect(mockUpdateDeviceTwin).toBeCalled();
        });
    });
});
