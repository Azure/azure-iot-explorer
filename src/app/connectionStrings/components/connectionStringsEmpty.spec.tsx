/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConnectionStringsEmpty } from './connectionStringsEmpty';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('ConnectionStringsEmpty', () => {
    it('renders empty state header and description', () => {
        render(<MemoryRouter><ConnectionStringsEmpty/></MemoryRouter>);

        expect(screen.getByText('connectionStrings.empty.header')).toBeDefined();
        expect(screen.getByText('connectionStrings.empty.description')).toBeDefined();
    });

    it('renders Home link pointing to root', () => {
        render(<MemoryRouter><ConnectionStringsEmpty/></MemoryRouter>);

        const homeLink = screen.getByText('Home.');
        expect(homeLink).toBeDefined();
        expect(homeLink.closest('a').getAttribute('href')).toBe('/');
    });

    it('renders questions header and external help link', () => {
        render(<MemoryRouter><ConnectionStringsEmpty/></MemoryRouter>);

        expect(screen.getByText('settings.questions.headerText')).toBeDefined();
        expect(screen.getByText('connectivityPane.connectionStringComboBox.linkText')).toBeDefined();
    });
});
