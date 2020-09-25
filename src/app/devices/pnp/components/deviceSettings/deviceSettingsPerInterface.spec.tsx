/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { Overlay } from 'office-ui-fabric-react/lib/components/Overlay';
import { DeviceSettingsPerInterface, DeviceSettingDataProps, DeviceSettingDispatchProps } from './deviceSettingsPerInterface';
import { DeviceSettingsPerInterfacePerSetting } from './deviceSettingsPerInterfacePerSetting';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';
import { testModelDefinition, testDigitalTwin, testComponentName } from './testData';

describe('components/devices/deviceSettingsPerInterface', () => {
    const twinWithSchema = generateTwinSchemaAndInterfaceTuple(testModelDefinition, testDigitalTwin, testComponentName).twinWithSchema;
    const deviceSettingsProps: DeviceSettingDataProps = {
        componentName: testComponentName,
        deviceId: 'testDevice',
        interfaceId: 'urn:contoso:com:EnvironmentalSensor;1',
        twinWithSchema
    };

    const deviceSettingsDispatchProps: DeviceSettingDispatchProps = {
        patchDigitalTwin: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceSettingsProps,
            ...deviceSettingsDispatchProps,
            ...overrides
        };

        return <DeviceSettingsPerInterface {...props} />;
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('toggles collapsed', () => {
        const wrapper = mount(getComponent());
        const iconButton = wrapper.find('.collapse-button').find(IconButton).first();
        expect(iconButton.props().title).toEqual('deviceSettings.command.collapseAll');

        act(() => iconButton.props().onClick(undefined));
        wrapper.update();
        const updatedIconButton = wrapper.find('.collapse-button').find(IconButton).first();
        expect(updatedIconButton.props().title).toEqual('deviceSettings.command.expandAll');
    });

    it('executes handle toggle from child', () => {
        const wrapper = mount(getComponent());

        expect(wrapper.find(DeviceSettingsPerInterfacePerSetting).first().props().collapsed).toBeFalsy();

        act(() => wrapper.find(DeviceSettingsPerInterfacePerSetting).first().props().handleCollapseToggle());
        wrapper.update();
        expect(wrapper.find(DeviceSettingsPerInterfacePerSetting).first().props().collapsed).toBeTruthy();
    });

    it('shows overlay', () => {
        const wrapper = mount(getComponent());
        expect(wrapper.find(Overlay)).toEqual({});

        act(() => wrapper.find(DeviceSettingsPerInterfacePerSetting).first().props().handleOverlayToggle());
        wrapper.update();
        expect(wrapper.find(Overlay)).toBeDefined();
    });
});
