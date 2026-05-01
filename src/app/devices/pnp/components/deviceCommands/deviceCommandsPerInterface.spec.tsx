/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceCommandsPerInterface, DeviceCommandDataProps, DeviceCommandDispatchProps } from './deviceCommandsPerInterface';
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

describe('components/devices/deviceCommandsPerInterface', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DeviceCommandsPerInterface commandSchemas={[]} handleCollapseToggle={jest.fn()} handleExpandToggle={jest.fn()}/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
