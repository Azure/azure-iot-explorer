/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { DeviceCommandsPerInterface, DeviceCommandDataProps, DeviceCommandDispatchProps, DeviceCommandState } from './deviceCommandsPerInterface';
import { DeviceCommandsPerInterfacePerCommand } from './deviceCommandsPerInterfacePerCommand';

describe('components/devices/deviceCommandsPerInterface', () => {
    const deviceCommandsDispatchProps: DeviceCommandDispatchProps = {
        invokeDigitalTwinInterfaceCommand: jest.fn()
    };
    const deviceCommandDataProps: DeviceCommandDataProps = {
        commandSchemas: [
            {
                commandModelDefinition: {
                    '@type': 'Command',
                    'name': 'command1'
                },
                parsedSchema: {
                    description: 'command1 description',
                    name: 'command1'
                }
            }
        ],
        componentName: 'urn:interfaceId',
        deviceId: 'device1'
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceCommandDataProps,
            ...deviceCommandsDispatchProps,
            ...overrides
        };

        return (
            <DeviceCommandsPerInterface {...props} />
        );
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('toggles collapsed', () => {
        const wrapper = mount(getComponent());
        expect(wrapper.find('.collapse-button').find(IconButton).first().props().title).toEqual('deviceCommands.command.collapseAll');

        const button = wrapper.find(IconButton).first();
        act(() => button.simulate('click'));
        wrapper.update();
        expect(wrapper.find('.collapse-button').find(IconButton).first().props().title).toEqual('deviceCommands.command.expandAll');
    });

    it('executes handle toggle from child', () => {
        const wrapper = mount(getComponent());

        expect(wrapper.find(DeviceCommandsPerInterfacePerCommand).first().props().collapsed).toBeFalsy();

        act(() => wrapper.find(DeviceCommandsPerInterfacePerCommand).first().props().handleCollapseToggle());
        wrapper.update();
        expect(wrapper.find(DeviceCommandsPerInterfacePerCommand).first().props().collapsed).toBeTruthy();
    });
});
