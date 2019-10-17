/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DeviceListCell, DeviceListCellProps } from './deviceListCell';
import { mountWithLocalization, testSnapshot } from '../../../shared/utils/testHelpers';

describe('components/devices/deviceListCell', () => {
    const deviceListCellProps: DeviceListCellProps = {
        connectionString: 'string',
        device: {
            authenticationType: 'sas',
            cloudToDeviceMessageCount: '0',
            connectionState: 'connected',
            deviceId: 'testDeviceId',
            iotEdge: false,
            lastActivityTime: '0001-01-01T00:00:00Z',
            status: 'Enabled',
            statusUpdatedTime: '0001-01-01T00:00:00Z'
        },
        itemIndex: 1,
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceListCellProps,
            ...overrides,
        };
        return <DeviceListCell {...props} />;
    };

    it('matches snapshot while loading', () => {
        testSnapshot(getComponent());
    });

    it('render cell with pnp icon when interface ids are retrieved', () => {
        const wrapper = mountWithLocalization(getComponent());
        const cell = wrapper.find(DeviceListCell);
        cell.setState({isLoading: false, interfaceIds: ['interfaceId1']});
        wrapper.update();

        const icon = wrapper.find(Icon).first();
        expect(icon.props().iconName).toEqual('pnp-svg');
    });
});
