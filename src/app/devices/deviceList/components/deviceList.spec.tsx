/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DeviceListComponent, DeviceListDataProps, DeviceListDispatchProps } from './deviceList';
import { mountWithLocalization } from '../../../shared/utils/testHelpers';
import { DeviceSummary } from '../../../api/models/deviceSummary';

const pathname = `/`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ pathname })
}));

const devices: DeviceSummary[] = [
    {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: '0',
        connectionState: 'connected',
        deviceId: 'testDeviceId',
        iotEdge: false,
        lastActivityTime: '0001-01-01T00:00:00Z',
        status: 'Enabled',
        statusUpdatedTime: '0001-01-01T00:00:00Z'
    }
];

const deviceListDataProps: DeviceListDataProps = {
    devices,
    isFetching: false
};

const mockListDevices = jest.fn();
const deviceListDispatchProps: DeviceListDispatchProps = {
    deleteDevices: jest.fn(),
    listDevices: mockListDevices
};

const getComponent = (overrides = {}) => {
    const props = {
        ...deviceListDataProps,
        ...deviceListDispatchProps,
        ...overrides
    };

    return (
        <DeviceListComponent {...props} />
    );
};

describe('components/devices/DeviceList', () => {
    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();

        const wrapper = mount(getComponent());
        const deviceList = wrapper.find(DeviceListComponent);

        const commandBar = deviceList.find(CommandBar).first();
        // click the refresh button
        commandBar.props().items[1].onClick(null);
        wrapper.update();
        expect(mockListDevices).toBeCalled();

        // delete button is disabled by default
        expect(commandBar.props().items[2].disabled).toBeTruthy(); // tslint:disable-line:no-magic-numbers
    });
});
