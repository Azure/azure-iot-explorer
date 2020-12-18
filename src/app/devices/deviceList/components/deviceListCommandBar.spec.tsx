/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DeviceListCommandBar } from './deviceListCommandBar';

describe('deviceListCommandBar', () => {
    it('matches snapshot', () => {
        expect(shallow(<DeviceListCommandBar
            handleAdd={jest.fn}
            handleRefresh={jest.fn}
            handleDelete={jest.fn}
        />)).toMatchSnapshot();
    });
});
