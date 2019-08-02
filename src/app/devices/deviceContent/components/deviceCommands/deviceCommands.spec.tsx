/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DeviceCommands, { DeviceCommandDispatchProps , DeviceCommandsProps } from './deviceCommands';
import InterfaceNotFoundMessageBar from '../shared/interfaceNotFoundMessageBar';
import DeviceCommandsPerInterface from './deviceCommandsPerInterface';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';


describe('components/devices/deviceCommandsPerInterfacePerCommand', () => {
    const deviceCommandsProps: DeviceCommandsProps = {
        commandSchemas: [],
        interfaceName: 'interface1',
        isLoading: true,
    };

    const deviceCommandsDispatchProps: DeviceCommandDispatchProps = {
        invokeDigitalTwinInterfaceCommand: jest.fn(),
        refresh: jest.fn(),
        setInterfaceId: jest.fn()
    };

    const pathname = `/#/devices/detail/digitalTwins/commands/?id=device1&interfaceId=urn:iotInterfaces:com:interface1:1`;

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

        return mountWithLocalization(
            <DeviceCommands {...props} />, true, [pathname]
        );
    };

    it('matches snapshot while loading', () => {
        expect(getComponent()).toMatchSnapshot();
    });
    it('matches snapshot with empty commandSchemas', () => {
        const component = getComponent({ isLoading: false});
        const deviceCommandPerInterface = component.find(DeviceCommandsPerInterface).first();
        expect(deviceCommandPerInterface).toMatchSnapshot();
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
        const deviceCommandPerInterface = component.find(DeviceCommandsPerInterface).first();
        expect(deviceCommandPerInterface).toMatchSnapshot();
    });
});
