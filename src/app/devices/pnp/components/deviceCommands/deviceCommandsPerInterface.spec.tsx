/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceCommandsPerInterface } from './deviceCommandsPerInterface';

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

describe('components/devices/deviceCommandsPerInterface', () => {
    it('renders column headers', () => {
        render(<MemoryRouter><DeviceCommandsPerInterface commandSchemas={[]} deviceId="test" moduleId="" componentName="comp" invokeCommand={jest.fn()}/></MemoryRouter>);

        expect(screen.getByText('deviceCommands.columns.name')).toBeDefined();
        expect(screen.getByText('deviceCommands.columns.type')).toBeDefined();
    });

    it('renders collapse all button', () => {
        const { container } = render(<MemoryRouter><DeviceCommandsPerInterface commandSchemas={[]} deviceId="test" moduleId="" componentName="comp" invokeCommand={jest.fn()}/></MemoryRouter>);

        const collapseBtn = container.querySelector('.collapse-button button');
        expect(collapseBtn).toBeDefined();
    });

    it('renders empty list role when no commands', () => {
        render(<MemoryRouter><DeviceCommandsPerInterface commandSchemas={[]} deviceId="test" moduleId="" componentName="comp" invokeCommand={jest.fn()}/></MemoryRouter>);

        expect(screen.getByRole('main')).toBeDefined();
    });
});
