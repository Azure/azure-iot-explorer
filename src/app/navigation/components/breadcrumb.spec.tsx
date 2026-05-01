/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumb } from './breadcrumb';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('Breadcrumb', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><Breadcrumb/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
