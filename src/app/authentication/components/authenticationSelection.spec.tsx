/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthenticationSelection } from './authenticationSelection';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

const mockSetLoginPreference = jest.fn();
jest.mock('../context/authenticationStateContext', () => ({
    useAuthenticationStateContext: () => [
        { loginPreference: 'connectionString' },
        { setLoginPreference: mockSetLoginPreference }
    ]
}));

describe('AuthenticationSelection', () => {
    it('renders heading', () => {
        render(<MemoryRouter><AuthenticationSelection/></MemoryRouter>);

        expect(screen.getByRole('heading')).toBeDefined();
    });

    it('renders connection string and Azure AD buttons', () => {
        render(<MemoryRouter><AuthenticationSelection/></MemoryRouter>);

        expect(screen.getByText('authentication.authSelection.selection.connectionString')).toBeDefined();
        expect(screen.getByText('authentication.authSelection.selection.azureActiveDirectory')).toBeDefined();
    });

    it('calls setLoginPreference when connection string button is clicked', () => {
        render(<MemoryRouter><AuthenticationSelection/></MemoryRouter>);

        fireEvent.click(screen.getByText('authentication.authSelection.selection.connectionString'));
        expect(mockSetLoginPreference).toHaveBeenCalled();
    });
});
