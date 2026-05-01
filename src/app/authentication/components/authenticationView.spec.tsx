/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
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
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><AuthenticationView/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
