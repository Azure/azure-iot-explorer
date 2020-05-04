/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import DeviceSettings, { DeviceSettingDispatchProps , DeviceSettingsProps } from './deviceSettings';
import { mountWithLocalization, testSnapshot } from '../../../../shared/utils/testHelpers';
import { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';

export const twinWithSchema: TwinWithSchema = {
    isComponentContainedInDigitalTwin: true,
    metadata: {
        lastUpdatedTime: '2020-03-31T23:17:42.4813073Z'
    },
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
        required: null,
        title: 'brightness',
        type: 'number'
    }
};

describe('components/devices/deviceSettings', () => {
    const interfaceId = 'urn:contoso:com:EnvironmentalSensor:1';
    const deviceSettingsProps: DeviceSettingsProps = {
        componentName: 'environmentalSensor',
        interfaceId,
        isLoading: true,
        twinWithSchema: []
    };

    const refreshMock = jest.fn();
    const deviceSettingsDispatchProps: DeviceSettingDispatchProps = {
        patchDigitalTwin: jest.fn(),
        refresh: refreshMock,
        setComponentName: jest.fn()
    };

    const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/settings/?id=device1&componentName=foo&interfaceId=${interfaceId}`;

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

        return <DeviceSettings {...props} />;
    };

    it('matches snapshot while loading', () => {
        const wrapper = mountWithLocalization(
            getComponent(), false, true, [pathname]
        );
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot with one twinWithSchema', () => {
        const component = getComponent({
            isLoading: false,
            twinWithSchema: [twinWithSchema]});
        testSnapshot(component);
    });

    it('dispatch action when refresh button is clicked', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false}), false, true);
        const commandBar = wrapper.find(CommandBar).first();
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect(refreshMock).toBeCalled();
    });
});
