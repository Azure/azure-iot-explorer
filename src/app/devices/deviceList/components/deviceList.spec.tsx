/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { shallow } from 'enzyme';
import * as React from 'react';
import DeviceListComponent from './deviceList';
import { testWithLocalizationContext } from '../../../shared/utils/testHelpers';
import { DeviceSummary } from '../../../api/models/deviceSummary';

const devices: DeviceSummary[] = [
    {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: '0',
        deviceId: 'testDeviceId',
        lastActivityTime: '0001-01-01T00:00:00Z',
        status: 'Enabled',
        statusUpdatedTime: '0001-01-01T00:00:00Z'
    }
];
jest.mock('./deviceListCell', () => <></>);

describe('components/devices/DeviceList', () => {
    it('matches snapshot', () => {
        const wrapper = testWithLocalizationContext(
        <DeviceListComponent
            connectionString="connectionString"
            devices={devices}
            listDevices={jest.fn()}
            deleteDevices={jest.fn()}
            isFetching={false}
        />);

        expect(wrapper).toMatchSnapshot();
    });

    it('redirects on missing ConnectionString', () => {
        const wrapper = shallow(
        <DeviceListComponent
            connectionString=""
            devices={[]}
            listDevices={jest.fn()}
            deleteDevices={jest.fn()}
            isFetching={false}
        />);
        const child = shallow(wrapper.props().children());

        expect(child.find('Redirect').first().prop('to')).toBe('/');

    });
});
