/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceContentNavComponent, DeviceContentNavProps, NAV_LINK_ITEMS_DEVICE, NAV_LINK_ITEMS_NONEDGE_DEVICE } from './deviceContentNav';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '?deviceId=test', hash: '', state: null, key: 'default' }),
}));

describe('deviceContentNav', () => {
    const getComponent = (overrides = {}) => {
        const navDataProps: DeviceContentNavProps = {
            isEdgeDevice: true
        };

        const props = {
            ...navDataProps,
            ...overrides,
        };

        return <DeviceContentNavComponent {...props} />;
    };

    it('renders when the device is edge', () => {
        const { container } = render(<MemoryRouter>{getComponent()}</MemoryRouter>);
        expect(container).toBeDefined();
    });

    it('renders when the device is not edge', () => {
        const { container } = render(<MemoryRouter>{getComponent({ isEdgeDevice: false })}</MemoryRouter>);
        expect(container).toBeDefined();
    });

    it('renders when component is loading', () => {
        const { container } = render(<MemoryRouter>{getComponent({isLoading: true})}</MemoryRouter>);
        expect(container).toBeDefined();
    });
});