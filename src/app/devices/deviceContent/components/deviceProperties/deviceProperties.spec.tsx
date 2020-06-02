/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { DeviceProperties, DevicePropertiesDataProps , DevicePropertiesDispatchProps } from './deviceProperties';
import { TwinWithSchema } from './devicePropertiesPerInterface';
import { mountWithStoreAndRouter } from '../../../../shared/utils/testHelpers';
import { InterfaceNotFoundMessageBar } from '../shared/interfaceNotFoundMessageBar';

const interfaceId = 'urn:contoso:com:EnvironmentalSensor:1';
const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/properties/?id=device1&componentName=foo&interfaceId=${interfaceId}`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: `?id=device1&componentName=foo&interfaceId=${interfaceId}` , pathname }),
}));

export const twinWithSchema: TwinWithSchema = {
    propertyModelDefinition: {
        '@type': 'Property',
        'description': 'The state of the device. Two states online/offline are available',
        'displayName': 'Device State',
        'name': 'state',
        'schema': 'boolean'
    },
    propertySchema: {
        description: 'Device State / The state of the device. Two states online/offline are available',
        title: 'state',
        type: 'boolean'
    },
    reportedTwin: null
};

describe('components/devices/deviceProperties', () => {
    const devicePropertiesProps: DevicePropertiesDataProps = {
        isLoading: true,
        twinAndSchema: []
    };

    const refreshMock = jest.fn();
    const devicePropertiesDispatchProps: DevicePropertiesDispatchProps = {
        refresh: refreshMock,
        setComponentName: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...devicePropertiesProps,
            ...devicePropertiesDispatchProps,
            ...overrides
        };

        return (
            <DeviceProperties {...props} />
        );
    };

    it('shows Shimmer while loading', () => {
        const wrapper = mount(getComponent());

        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        expect(shallow(getComponent({isLoading: false, twinWithSchema: undefined}))).toMatchSnapshot();
        expect(shallow(getComponent()).find(InterfaceNotFoundMessageBar)).toBeDefined();
    });

    it('matches snapshot with one twinWithSchema', () => {
        expect(shallow(getComponent({
            isLoading: false,
            twinWithSchema: [twinWithSchema]}))).toMatchSnapshot();
    });

    it('dispatch action when refresh button is clicked', () => {
        const wrapper = shallow(getComponent({isLoading: false}));
        const commandBar = wrapper.find(CommandBar).first();

        act(() => commandBar.props().items[0].onClick(null));
        wrapper.update();
        expect(refreshMock).toBeCalled();
    });
});
