/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { DeviceModules } from './deviceModules';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: '?moduleId=mod1' }),
    useRouteMatch: () => ({ url: '' })
}));


describe('DeviceModules', () => {
    it('matches snapshot', () => {
        expect(shallow(
            <DeviceModules/>
        )).toMatchSnapshot();
    });
});