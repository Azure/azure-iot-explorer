/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react';
import DeviceSettings, { DeviceSettingDispatchProps , DeviceSettingsProps } from './deviceSettings';
import DeviceSettingsPerInterface from './deviceSettingsPerInterface';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';
import { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';
export const twinWithSchema: TwinWithSchema = {
    desiredTwin: 123,
    reportedTwin: null,
    settingModelDefinition: {
        '@type': 'Property',
        'description': 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
        'displayName': 'Brightness Level',
        'name': 'brightness',
        'schema': 'long',
        'writable': true
    },
    settingSchema: {
        description: 'Brightness Level / The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
        title: 'brightness',
        type: 'number'
    }
};

describe('components/devices/deviceSettings', () => {
    const interfaceId = 'urn:contoso:com:EnvironmentalSensor:1';
    const deviceSettingsProps: DeviceSettingsProps = {
        interfaceId,
        interfaceName: 'environmentalSensor',
        isLoading: true,
        twinWithSchema: []
    };

    const deviceSettingsDispatchProps: DeviceSettingDispatchProps = {
        patchDigitalTwinInterfaceProperties: jest.fn(),
        refresh: jest.fn(),
        setInterfaceId: jest.fn()
    };

    const pathname = `/#/devices/detail/digitalTwins/settings/?id=device1&interfaceId=${interfaceId}`;

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
            ...deviceSettingsProps,
            ...deviceSettingsDispatchProps,
            ...routerprops,
            ...overrides
        };

        return mountWithLocalization(
            <DeviceSettings {...props} />, true, [pathname]
        );
    };

    it('matches snapshot while loading', () => {
        const wrapper = getComponent();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot without twinWithSchema', () => {
        const wrapper = getComponent({ isLoading: false});
        const deviceSettingPerInterface = wrapper.find(DeviceSettingsPerInterface).first();
        expect(deviceSettingPerInterface).toMatchSnapshot();
    });

    it('matches snapshot with one twinWithSchema', () => {
        const component = getComponent({
            isLoading: false,
            twinWithSchema: [twinWithSchema]});
        const deviceSettingPerInterface = component.find(DeviceSettingsPerInterface).first();
        expect(deviceSettingPerInterface).toMatchSnapshot();
    });
});
