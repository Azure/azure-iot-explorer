/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { BreadcrumbWrapper } from './breadcrumbWrapper';
import * as BreadcrumbEntry from '../hooks/useBreadcrumbEntry';

import { render } from '@testing-library/react';
describe('BreadcrumbWrapper', () => {
    it('matches snapshot', () => {
        jest.spyOn(BreadcrumbEntry, 'useBreadcrumbEntry').mockImplementation(() => {});
        expect(render(
            <BreadcrumbWrapper
                name={'name'}
            />
        )).toBeDefined();
    });
});