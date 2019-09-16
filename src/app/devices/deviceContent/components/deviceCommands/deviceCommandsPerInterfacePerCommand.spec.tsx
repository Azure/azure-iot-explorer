/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DeviceCommandsPerInterfacePerCommand, { DeviceCommandDataProps, DeviceCommandDispatchProps } from './deviceCommandsPerInterfacePerCommand';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';

describe('components/devices/deviceCommandsPerInterfacePerCommand', () => {
    const deviceCommandsDispatchProps: DeviceCommandDispatchProps = {
        handleCollapseToggle: jest.fn(),
        invokeDigitalTwinInterfaceCommand: jest.fn()
    };
    const deviceCommandDataProps: DeviceCommandDataProps = {
        collapsed: true,
        commandModelDefinition: {
            '@type': 'Command',
            'name': 'command1'
        },
        deviceId: 'deviceId',
        interfaceName: 'urn:interfaceId',
        parsedSchema: {
            description: 'command1 description',
            name: 'command1'
        }
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceCommandDataProps,
            ...deviceCommandsDispatchProps,
            ...overrides
        };

        return mountWithLocalization(
            <DeviceCommandsPerInterfacePerCommand {...props} />
        );
    };

    it('matches snapshot for simple command', () => {
        expect(getComponent()).toMatchSnapshot();
    });
    it('matches snapshot for simple command uncollapsed', () => {
        expect(getComponent({collapsed: false})).toMatchSnapshot();
    });
    it('matches snapshot for command with displayName, description and commandType', () => {
        const comp = getComponent({commandModelDefinition: {
            '@type': 'Command',
            'commandType': 'testing',
            'description': 'Command description for testing',
            'displayName': 'Command Number 1',
            'name': 'command1',
        }});

        expect(comp).toMatchSnapshot();
    });
});
