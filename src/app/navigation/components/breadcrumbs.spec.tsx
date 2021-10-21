/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { Breadcrumbs } from './breadcrumbs';
import * as BreadcrumbContext from '../hooks/useBreadcrumbContext';

describe('Breadcrumbs', () => {
    it('matches snapshot', () => {
        jest.spyOn(BreadcrumbContext, 'useBreadcrumbContext').mockReturnValue({
            stack: [
                { name: 'name1', url: 'url1', path: 'path1', suffix: '', disableLink: true},
                { name: 'name2', url: 'url2', path: 'path2', suffix: ''},
                { name: 'name3', url: 'url3', path: 'path3', suffix: ''},
            ],
            registerEntry: jest.fn(),
            unregisterEntry: jest.fn()});

            expect(shallow(
            <Breadcrumbs/>
        )).toMatchSnapshot();
    });
});