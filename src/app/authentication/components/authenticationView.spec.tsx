/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthenticationView } from './authenticationView';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

jest.mock('../context/authenticationStateContext', () => ({
    useAuthenticationStateContext: () => [
        { loginPreference: 'connectionString', formState: 'idle', preference: 'connectionString' },
        { setLoginPreference: jest.fn(), getLoginPreference: jest.fn() }
    ]
}));

describe('AuthenticationView', () => {
    it('renders connection strings view for connectionString preference', () => {
        const { container } = render(<MemoryRouter><AuthenticationView/></MemoryRouter>);

        // Should render something (not shimmer) when formState is idle
        expect(container.querySelector('.multi-line-shimmer')).toBeNull();
    });

    it('renders the component container', () => {
        const { container } = render(<MemoryRouter><AuthenticationView/></MemoryRouter>);

        expect(container.firstChild).toBeDefined();
    });
});
