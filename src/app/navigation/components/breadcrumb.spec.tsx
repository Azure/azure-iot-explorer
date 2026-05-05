/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
    it('renders as link when disableLink is false', () => {
        render(<MemoryRouter><Breadcrumb name="Home" url="/home" disableLink={false}/></MemoryRouter>);

        const link = screen.getByText('Home');
        expect(link.closest('a')).toBeInTheDocument();
    });

    it('renders as plain text when disableLink is true', () => {
        const { container } = render(<MemoryRouter><Breadcrumb name="Current" url="/current" disableLink={true}/></MemoryRouter>);

        expect(screen.getByText('Current')).toBeInTheDocument();
        // Check no anchor within the breadcrumb item specifically
        expect(container.querySelector('li.breadcrumb-item a')).toBeNull();
    });

    it('renders inside a list item', () => {
        const { container } = render(<MemoryRouter><Breadcrumb name="Test" url="/test" disableLink={false}/></MemoryRouter>);

        expect(container.querySelector('li.breadcrumb-item')).toBeInTheDocument();
    });
});
