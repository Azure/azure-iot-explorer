/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumbs } from './breadcrumbs';
import * as BreadcrumbContext from '../hooks/useBreadcrumbContext';

describe('Breadcrumbs', () => {
    it('renders breadcrumb list element', () => {
        jest.spyOn(BreadcrumbContext, 'useBreadcrumbContext').mockReturnValue({
            stack: [],
            push: jest.fn(),
            pop: jest.fn()
        } as any);

        const { container } = render(<MemoryRouter><Breadcrumbs/></MemoryRouter>);

        expect(container.querySelector('ul.breadcrumb')).toBeInTheDocument();
    });

    it('renders breadcrumb items from stack', () => {
        jest.spyOn(BreadcrumbContext, 'useBreadcrumbContext').mockReturnValue({
            stack: [
                { name: 'Home', path: '/home', url: '/home', disableLink: false },
                { name: 'Devices', path: '/devices', url: '/devices', disableLink: true }
            ],
            push: jest.fn(),
            pop: jest.fn()
        } as any);

        const { container } = render(<MemoryRouter><Breadcrumbs/></MemoryRouter>);

        const items = container.querySelectorAll('li.breadcrumb-item');
        expect(items.length).toBe(2);
    });
});
