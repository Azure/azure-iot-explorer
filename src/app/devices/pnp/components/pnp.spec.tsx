/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { Pnp } from './pnp';

const search = '?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1;1';
const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/${search}`;
jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search, pathname }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('pnp', () => {
    it('matches snapshot', () => {
        expect(shallow(<Pnp/>)).toMatchSnapshot();
    });
});
