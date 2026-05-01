/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListItemPublicRepo } from './listItemPublicRepo';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('ListItemPublicRepo', () => {
    it('renders public repo label', () => {
        render(<MemoryRouter><ListItemPublicRepo/></MemoryRouter>);

        expect(screen.getByText('modelRepository.types.public.label')).toBeDefined();
    });

    it('renders read-only input with URL', () => {
        render(<MemoryRouter><ListItemPublicRepo/></MemoryRouter>);

        const input = screen.getByLabelText('modelRepository.types.configurable.textBoxLabel');
        expect((input as HTMLInputElement).readOnly).toBe(true);
    });
});
