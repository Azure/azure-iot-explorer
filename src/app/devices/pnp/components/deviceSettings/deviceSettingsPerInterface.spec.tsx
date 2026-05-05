/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceSettingsPerInterface } from './deviceSettingsPerInterface';

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

describe('components/devices/deviceSettingsPerInterface', () => {
    const defaultProps = {
        deviceId: 'testDevice',
        moduleId: '',
        interfaceId: 'testInterface',
        twinWithSchema: [],
        patchTwin: jest.fn()
    };

    it('renders the settings list container', () => {
        const { container } = render(<MemoryRouter><DeviceSettingsPerInterface {...defaultProps as any}/></MemoryRouter>);

        expect(container.querySelector('.pnp-detail-list')).toBeInTheDocument();
    });

    it('renders with empty twinWithSchema', () => {
        const { container } = render(<MemoryRouter><DeviceSettingsPerInterface {...defaultProps as any}/></MemoryRouter>);

        expect(container).toBeDefined();
    });
});
