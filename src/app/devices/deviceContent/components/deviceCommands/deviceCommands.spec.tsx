/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DeviceCommands, DeviceCommandDispatchProps , DeviceCommandsProps } from './deviceCommands';
import { InterfaceNotFoundMessageBar } from '../shared/interfaceNotFoundMessageBar';

const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/commands/?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1:1`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1:1', pathname }),
}));

describe('components/devices/deviceCommands', () => {
    const deviceCommandsProps: DeviceCommandsProps = {
        commandSchemas: [],
        isLoading: true,
    };

    const refreshMock = jest.fn();
    const deviceCommandsDispatchProps: DeviceCommandDispatchProps = {
        invokeDigitalTwinInterfaceCommand: jest.fn(),
        refresh: refreshMock,
        setComponentName: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceCommandsProps,
            ...deviceCommandsDispatchProps,
            ...overrides
        };

        return (
            <DeviceCommands {...props} />
        );
    };

    it('shows Shimmer while loading', () => {
        const wrapper = mount(getComponent());
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        expect(shallow(getComponent({isLoading: false, commandSchemas: undefined}))).toMatchSnapshot();
        const wrapper = mount(getComponent());
        expect(wrapper.find(InterfaceNotFoundMessageBar)).toBeDefined();
    });

    it('matches snapshot with a commandSchema', () => {
        const component = getComponent({
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
            isLoading: false});

        expect(shallow(component)).toMatchSnapshot();
    });

    it('dispatch action when refresh button is clicked', () => {
        const wrapper = shallow(getComponent({isLoading: false}));
        const commandBar = wrapper.find(CommandBar).first();

        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect(refreshMock).toBeCalled();
    });
});
