/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import DeviceCommands, { DeviceCommandDispatchProps , DeviceCommandsProps } from './deviceCommands';
import { testSnapshot, mountWithLocalization } from '../../../../shared/utils/testHelpers';
import { InterfaceNotFoundMessageBar } from '../shared/interfaceNotFoundMessageBar';

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

    const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/commands/?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1:1`;

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
            ...deviceCommandsProps,
            ...deviceCommandsDispatchProps,
            ...routerprops,
            ...overrides
        };

        return (
            <DeviceCommands {...props} />
        );
    };

    it('shows Shimmer while loading', () => {
        const wrapper = mountWithLocalization(
            getComponent(), false, true, [pathname]
        );
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        testSnapshot(getComponent({isLoading: false, commandSchemas: undefined}));
        const wrapper = mountWithLocalization(getComponent(), true);
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
