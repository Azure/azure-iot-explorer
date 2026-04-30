/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { IotHub } from './iotHub';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('IotHub', () => {
    it('matches snapshot', () => {
        expect(shallow(<IotHub/>)).toMatchSnapshot();
    });
});
