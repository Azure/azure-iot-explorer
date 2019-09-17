/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import DeviceProperties, { DevicePropertiesDataProps , DevicePropertiesDispatchProps } from './deviceProperties';
import DevicePropertiesPerInterface from './devicePropertiesPerInterface';
import { TwinWithSchema } from './devicePropertiesPerInterfacePerProperty';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';

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

    const devicePropertiesDispatchProps: DevicePropertiesDispatchProps = {
        refresh: jest.fn(),
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

        return mountWithLocalization(
            <DeviceProperties {...props} />, true, [pathname]
        );
    };

    it('matches snapshot while loading', () => {
        const wrapper = getComponent();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot with one twinWithSchema', () => {
        const component = getComponent({
            isLoading: false,
            twinWithSchema: [twinWithSchema]});
        const devicePropertyPerInterface = component.find(DevicePropertiesPerInterface).first();
        expect(devicePropertyPerInterface).toMatchSnapshot();
    });
});
