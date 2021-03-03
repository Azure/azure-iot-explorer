/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { BreadcrumbWrapper } from './breadcrumbWrapper';
import * as BreadcrumbEntry from '../hooks/useBreadcrumbEntry';

describe('BreadcrumbWrapper', () => {
    it('matches snapshot', () => {
        jest.spyOn(BreadcrumbEntry, 'useBreadcrumbEntry').mockImplementation(() => {});
        expect(shallow(
            <BreadcrumbWrapper
                name={'name'}
            />
        )).toMatchSnapshot();
    });
});