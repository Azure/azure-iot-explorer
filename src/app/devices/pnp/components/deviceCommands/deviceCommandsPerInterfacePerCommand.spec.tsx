/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceCommandsPerInterfacePerCommand } from './deviceCommandsPerInterfacePerCommand';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

jest.mock('../../context/pnpStateContext', () => ({
    usePnpStateContext: () => ({
        pnpState: {
            twin: { payload: null, synchronizationStatus: 'initialized' },
            modelDefinitionWithSource: { payload: null, synchronizationStatus: 'initialized' }
        },
        dispatch: jest.fn(),
        getModelDefinition: jest.fn()
    })
}));

const defaultProps = {
    commandModelDefinition: { name: 'testCmd', displayName: 'Test Command', description: 'desc' },
    parsedSchema: { name: 'testCmd', requestSchema: null, responseSchema: null },
    componentName: 'testComponent',
    deviceId: 'testDevice',
    moduleId: '',
    collapsed: false,
    handleCollapseToggle: jest.fn(),
    invokeCommand: jest.fn()
};

describe('components/devices/deviceCommandsPerInterfacePerCommand', () => {
    it('renders command name', () => {
        render(<MemoryRouter><DeviceCommandsPerInterfacePerCommand {...defaultProps as any}/></MemoryRouter>);

        expect(screen.getByText(/testCmd/)).toBeDefined();
    });

    it('renders submit button when not collapsed and no request schema', () => {
        render(<MemoryRouter><DeviceCommandsPerInterfacePerCommand {...defaultProps as any}/></MemoryRouter>);

        expect(screen.getByText('deviceCommands.command.submit')).toBeDefined();
    });

    it('hides detail section when collapsed', () => {
        const { container } = render(<MemoryRouter><DeviceCommandsPerInterfacePerCommand {...{...defaultProps, collapsed: true} as any}/></MemoryRouter>);

        expect(screen.queryByText('deviceCommands.command.submit')).toBeNull();
    });
});
