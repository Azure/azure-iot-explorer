/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { DeviceList } from './deviceList';
import { deviceListStateInitial, DeviceListStateInterface } from '../state';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import { DeviceListCommandBar } from './deviceListCommandBar';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { listDevicesAction } from '../actions';

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

const initialState: DeviceListStateInterface = {
    ...deviceListStateInitial(),
    devices
};

describe('DeviceList', () => {
    beforeEach(() => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([initialState, jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('matches snapshot', () => {
        const listDevicesActionSpy = jest.spyOn(listDevicesAction, 'started');
        const wrapper = shallow(<DeviceList/>);

        expect(wrapper).toMatchSnapshot();
        const commandBar = wrapper.find(DeviceListCommandBar).first();
        // click the refresh button
        act(() => commandBar.props().handleRefresh());
        wrapper.update();
        expect(listDevicesActionSpy).lastCalledWith({
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: ''
        });

        // delete button is disabled by default
        expect(wrapper.find(DeviceListCommandBar).first().props().disableDelete).toBeTruthy(); // tslint:disable-line:no-magic-numbers
    });
});
