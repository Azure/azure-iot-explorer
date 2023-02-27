/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { IconButton, Overlay } from '@fluentui/react';
import { DeviceSettingsPerInterface, DeviceSettingDataProps, DeviceSettingDispatchProps } from './deviceSettingsPerInterface';
import { DeviceSettingsPerInterfacePerSetting } from './deviceSettingsPerInterfacePerSetting';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';
import { testModelDefinition, testTwin, testComponentName } from './testData';

describe('components/devices/deviceSettingsPerInterface', () => {
    const twinWithSchema = generateTwinSchemaAndInterfaceTuple(testModelDefinition, testTwin, testComponentName);
    const deviceSettingsProps: DeviceSettingDataProps = {
        componentName: testComponentName,
        deviceId: 'testDevice',
        interfaceId: 'urn:contoso:com:EnvironmentalSensor;1',
        twinWithSchema,
        moduleId: ''
    };

    const deviceSettingsDispatchProps: DeviceSettingDispatchProps = {
        patchTwin: jest.fn()
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
