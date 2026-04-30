/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DeviceContent } from './deviceContent';

const pathname = '/#/devices/detail/?id=testDevice';
jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: '', search: '?id=testDevice', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),

}));

describe('deviceContent', () => {
    it('matches snapshot', () => {
        expect(shallow(<DeviceContent/>)).toMatchSnapshot();
    });
});
