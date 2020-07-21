/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModuleIdentityDetailHeader } from './moduleIdentityDetailHeader';

const search = '?id=device1';
const pathname = `/#/devices/deviceDetail/moduleIdentity/moduleDetail/${search}`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search, pathname }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('ModuleIdentityDetailHeader', () => {
    it('matches snapshot', () => {
        expect(shallow(<ModuleIdentityDetailHeader/>)).toMatchSnapshot();
    });
});
