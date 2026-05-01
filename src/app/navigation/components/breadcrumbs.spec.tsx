/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { Breadcrumbs } from './breadcrumbs';
import * as BreadcrumbContext from '../hooks/useBreadcrumbContext';


describe('Breadcrumbs', () => {
    it('renders without crashing', () => {
        const { container } = render(<Breadcrumbs/>);
        expect(container).toBeDefined();
    });
});
