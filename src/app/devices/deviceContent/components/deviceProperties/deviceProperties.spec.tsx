/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import DeviceProperties, { DevicePropertiesDataProps , DevicePropertiesDispatchProps } from './deviceProperties';
import { TwinWithSchema } from './devicePropertiesPerInterfacePerProperty';
import { mountWithLocalization, testSnapshot } from '../../../../shared/utils/testHelpers';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';

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
    const interfaceId = 'urn:contoso:com:EnvironmentalSensor:1';
    const devicePropertiesProps: DevicePropertiesDataProps = {
        isLoading: true,
        twinAndSchema: []
    };

    const refreshMock = jest.fn();
    const devicePropertiesDispatchProps: DevicePropertiesDispatchProps = {
        refresh: refreshMock,
        setInterfaceId: jest.fn()
    };

    const pathname = `/#/devices/detail/digitalTwins/properties/?id=device1&interfaceId=${interfaceId}`;

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

    const getComponent = (overrides = {}) => {
        const props = {
            ...devicePropertiesProps,
            ...devicePropertiesDispatchProps,
            ...routerprops,
            ...overrides
        };

        return (
            <DeviceProperties {...props} />
        );
    };

    it('shows Shimmer while loading', () => {
        const wrapper = mountWithLocalization(
            getComponent(), false, true, [pathname]
        );
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        testSnapshot(getComponent({isLoading: false, twinWithSchema: undefined}));
        const wrapper = mountWithLocalization(getComponent(), true);
        expect(wrapper.find(InterfaceNotFoundMessageBoxContainer)).toBeDefined();
    });

    it('matches snapshot with one twinWithSchema', () => {
        const component = getComponent({
            isLoading: false,
            twinWithSchema: [twinWithSchema]});
        testSnapshot(component);
    });

    it('dispatch action when refresh button is clicked', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false}));
        const commandBar = wrapper.find(CommandBar).first();
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect(refreshMock).toBeCalled();
    });
});
