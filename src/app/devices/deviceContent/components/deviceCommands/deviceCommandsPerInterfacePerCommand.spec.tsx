/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import DeviceCommandsPerInterfacePerCommand, { DeviceCommandDataProps, DeviceCommandDispatchProps } from './deviceCommandsPerInterfacePerCommand';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';
import DataForm from '../shared/dataForm';

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

    it('renders for simple command', () => {
        const wrapper = getComponent();
        const nameLabel = wrapper.find(Label).first();
        expect((nameLabel.props().children as any).join('')).toEqual(`command1 (-- / --)`);  // tslint:disable-line:no-any

        const requestLabel = wrapper.find(Label).at(1);
        expect(requestLabel.props().children).toEqual('--');

        const responseLabel = wrapper.find(Label).at(2); // tslint:disable-line:no-magic-numbers
        expect(responseLabel.props().children).toEqual('--');

        const typeLabel = wrapper.find(Label).at(3); // tslint:disable-line:no-magic-numbers
        expect(typeLabel.props().children).toEqual('--');
    });

    it('renders for command with displayName, description, commandType and request schema', () => {
        const wrapper = getComponent({
            collapsed: false,
            commandModelDefinition: {
                '@type': 'Command',
                'commandType': 'synchronous',
                'description': 'Command description for testing',
                'displayName': 'Command Number 1',
                'name': 'command1',
                'request': {
                    name: 'interval',
                    schema: 'long'
                }
            },
            parsedSchema: {
                description: 'Command description for testing',
                name: 'command1',
                requestSchema: {
                    description: '',
                    title: 'interval',
                    type: 'number'
                }
            }
        });

        const nameLabel = wrapper.find(Label).first();
        expect((nameLabel.props().children as any).join('')).toEqual(`command1 (Command Number 1 / Command description for testing)`);  // tslint:disable-line:no-any

        const requestLabel = wrapper.find(Label).at(1);
        expect(requestLabel.props().children).toEqual('long');

        const responseLabel = wrapper.find(Label).at(2); // tslint:disable-line:no-magic-numbers
        expect(responseLabel.props().children).toEqual('--');

        const typeLabel = wrapper.find(Label).at(3); // tslint:disable-line:no-magic-numbers
        expect(typeLabel.props().children).toEqual('synchronous');

        const dataForm = wrapper.find(DataForm).first();
        expect(dataForm).toBeDefined();
        expect(dataForm.props().buttonText).toEqual('deviceCommands.command.submit');
    });
});
