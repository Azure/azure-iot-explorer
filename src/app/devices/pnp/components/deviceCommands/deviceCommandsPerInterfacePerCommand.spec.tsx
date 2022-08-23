/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { mount } from 'enzyme';
import * as React from 'react';
import { Label } from '@fluentui/react';
import { DeviceCommandsPerInterfacePerCommand, DeviceCommandDataProps, DeviceCommandDispatchProps } from './deviceCommandsPerInterfacePerCommand';
import { DataForm } from '../../../shared/components/dataForm';
import { SendCommandConfirmation } from './sendCommandConfirmation';

describe('components/devices/deviceCommandsPerInterfacePerCommand', () => {
    const deviceCommandsDispatchProps: DeviceCommandDispatchProps = {
        handleCollapseToggle: jest.fn(),
        invokeCommand: jest.fn()
    };
    const deviceCommandDataProps: DeviceCommandDataProps = {
        collapsed: true,
        commandModelDefinition: {
            '@type': 'Command',
            'name': 'command1'
        },
        componentName: 'sensor',
        deviceId: 'deviceId',
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

        return mount(
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

    describe('send confirmation scenario', () => {
        it('launches send confirmation when showConfirmationDialog is true', () => {
            jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
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
    
            const sendCommandConfirmation = wrapper.find(SendCommandConfirmation);
            expect(sendCommandConfirmation.props().hidden).toEqual(false);
        });

        it('calls onConfirmSendCommand when SendCommandConfirmation confirmed', () => {
            const onConfirmSendCommand = jest.fn();
            jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));

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
    

            const sendCommandConfirmation = wrapper.find(SendCommandConfirmation);
            sendCommandConfirmation.props().onSendConfirm = onConfirmSendCommand;
            sendCommandConfirmation.props().onSendConfirm();
            wrapper.update();

            expect(onConfirmSendCommand).toHaveBeenCalled();
        });

        it('calls onCancelSendCommand when SendCommandConfirmation canceled', () => {
            const onCancelSendCommand = jest.fn();
            jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));

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
    

            const sendCommandConfirmation = wrapper.find(SendCommandConfirmation);
            sendCommandConfirmation.props().onSendCancel = onCancelSendCommand;
            sendCommandConfirmation.props().onSendCancel();
            wrapper.update();


            expect(onCancelSendCommand).toHaveBeenCalled();
        });
    });

});
