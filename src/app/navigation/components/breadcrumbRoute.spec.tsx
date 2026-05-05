/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BreadcrumbRoute } from './breadcrumbRoute';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('BreadcrumbRoute', () => {
    it('renders children within wrapper', () => {
        const { container } = render(<MemoryRouter><BreadcrumbRoute><span data-testid="child">Hello</span></BreadcrumbRoute></MemoryRouter>);

        expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
    });
});
