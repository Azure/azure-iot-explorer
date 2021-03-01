/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { BreadcrumbRoute } from './breadcrumbRoute';

describe('BreadcrumbRoute', () => {
    it('matches snapshot', () => {
        expect(shallow(
            <BreadcrumbRoute
                path={'path'}
                exact={true}
                breadcrumb={{name: 'name'}}
            />
        )).toMatchSnapshot();
    });
});