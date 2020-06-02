/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DeviceSettings, DeviceSettingDispatchProps , DeviceSettingsProps } from './deviceSettings';
import { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';

const interfaceId = 'urn:contoso:com:EnvironmentalSensor:1';
const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/settings/?id=device1&componentName=foo&interfaceId=${interfaceId}`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: `?id=device1&componentName=foo&interfaceId=${interfaceId}`, pathname }),
}));

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
        required: [],
        title: 'brightness',
        type: 'number'
    }
};

describe('components/devices/deviceSettings', () => {
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

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceSettingsProps,
            ...deviceSettingsDispatchProps,
            ...overrides
        };

        return <DeviceSettings {...props} />;
    };

    it('matches snapshot while loading', () => {
        const wrapper = mount(getComponent());
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot with one twinWithSchema', () => {
        expect(shallow(getComponent({
            isLoading: false,
            twinWithSchema: [twinWithSchema]}))).toMatchSnapshot();
    });

    it('dispatch action when refresh button is clicked', () => {
        const wrapper = shallow(getComponent({isLoading: false}));
        const commandBar = wrapper.find(CommandBar).first();
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect(refreshMock).toBeCalled();
    });
});
