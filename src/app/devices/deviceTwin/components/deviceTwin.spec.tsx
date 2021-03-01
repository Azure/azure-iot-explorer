/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { DeviceTwin } from './deviceTwin';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { DeviceTwinStateInterface } from './../state';
import { getDeviceTwinAction, updateDeviceTwinAction } from '../actions';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: '?deviceId=test' }),
}));

// tslint:disable
const twin = {
    deviceEtag: '',
    deviceId: 'test',
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
};
// tslint:enable
const initialState: DeviceTwinStateInterface = {
    deviceTwin: {
        payload: twin,
        synchronizationStatus: SynchronizationStatus.fetched
    }
};
describe('devices/components/deviceTwin', () => {

    beforeEach(() => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([initialState, jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    context('snapshot', () => {
        it('matches snapshot', () => {
            expect(shallow(<DeviceTwin/>)).toMatchSnapshot();
        });

        it('calls refresh and save', () => {
            const realUseState = React.useState;
            const mockGetDeviceTwin = jest.spyOn(getDeviceTwinAction, 'started');
            const mockUpdateDeviceTwin = jest.spyOn(updateDeviceTwinAction, 'started');
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState({
                isDirty: true,
                isTwinValid: true,
                twin: JSON.stringify(twin)
            }));

            const wrapper = mount(<DeviceTwin/>);
            let commandBar = wrapper.find(CommandBar).first();
            act(() => commandBar.props().items[0].onClick(null));
            expect(mockGetDeviceTwin.mock.calls[0][0]).toEqual('test');

            commandBar = wrapper.find(CommandBar).first();
            act(() => commandBar.props().items[1].onClick(null));
            wrapper.update();
            expect(mockUpdateDeviceTwin.mock.calls[0][0]).toEqual(twin);
        });
    });
});
