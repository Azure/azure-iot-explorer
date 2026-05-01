/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceContentNavComponent, NAV_LINK_ITEMS_DEVICE, NAV_LINK_ITEMS_NONEDGE_DEVICE } from './deviceContentNav';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '?deviceId=test', hash: '', state: null, key: 'default' }),
}));

describe('DeviceContentNav', () => {
    it('renders navigation links for edge device', () => {
        const { container } = render(<MemoryRouter><DeviceContentNavComponent isEdgeDevice={true}/></MemoryRouter>);

        const links = container.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
    });

    it('renders navigation links for non-edge device', () => {
        const { container } = render(<MemoryRouter><DeviceContentNavComponent isEdgeDevice={false}/></MemoryRouter>);

        const links = container.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
    });

    it('renders expected tab labels for edge device', () => {
        render(<MemoryRouter><DeviceContentNavComponent isEdgeDevice={true}/></MemoryRouter>);

        // Edge devices should show all nav items including module identity
        expect(screen.getAllByText('breadcrumb.identity').length).toBeGreaterThan(0);
        expect(screen.getAllByText('breadcrumb.twin').length).toBeGreaterThan(0);
    });
});