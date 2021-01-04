/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModuleDirectMethod } from './moduleDirectMethod';

const pathname = '#/devices/deviceDetail/moduleIdentity/moduleTwin/?deviceId=newdevice&moduleId=moduleId';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?deviceId=newdevice&moduleId=moduleId', pathname }),
}));

describe('moduleDirectMethod', () => {
    it('matches snapshot', () => {
        expect(shallow(<ModuleDirectMethod/>)).toMatchSnapshot();
    });
});
