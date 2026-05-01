/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListItemPublicRepo } from './listItemPublicRepo';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('ListItemPublicRepo', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><ListItemPublicRepo/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
