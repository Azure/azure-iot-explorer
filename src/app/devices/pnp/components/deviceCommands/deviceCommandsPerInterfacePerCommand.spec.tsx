/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceCommandsPerInterfacePerCommand, DeviceCommandDataProps, DeviceCommandDispatchProps } from './deviceCommandsPerInterfacePerCommand';
import { DataForm } from '../../../shared/components/dataForm';
import { SendCommandConfirmation } from './sendCommandConfirmation';

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

describe('components/devices/deviceCommandsPerInterfacePerCommand', () => {
    it('renders without crashing', () => {
        const props = {
            commandModelDefinition: { name: 'testCmd', displayName: 'Test Command', description: 'desc' },
            parsedSchema: { name: 'testCmd', requestSchema: null, responseSchema: null },
            componentName: 'testComponent',
            deviceId: 'testDevice',
            moduleId: '',
            collapsed: false,
            handleCollapseToggle: jest.fn(),
            invokeCommand: jest.fn()
        };
        const { container } = render(<MemoryRouter><DeviceCommandsPerInterfacePerCommand {...props as any}/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
