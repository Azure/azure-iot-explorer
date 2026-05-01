/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DigitalTwinDetail } from './digitalTwinDetail';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/ioTPlugAndPlayDetail/interfaces/', search: '?deviceId=test', hash: '', state: null, key: 'default' })
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

describe('DigitalTwinDetail', () => {
    it('renders tab list with PnP tabs', () => {
        render(<MemoryRouter><DigitalTwinDetail/></MemoryRouter>);

        expect(screen.getAllByText('breadcrumb.interfaces').length).toBeGreaterThan(0);
        expect(screen.getAllByText('breadcrumb.properties').length).toBeGreaterThan(0);
        expect(screen.getAllByText('breadcrumb.settings').length).toBeGreaterThan(0);
        expect(screen.getAllByText('breadcrumb.commands').length).toBeGreaterThan(0);
    });

    it('renders the tab list with proper aria label', () => {
        render(<MemoryRouter><DigitalTwinDetail/></MemoryRouter>);

        expect(screen.getByRole('tablist')).toBeDefined();
    });
});
