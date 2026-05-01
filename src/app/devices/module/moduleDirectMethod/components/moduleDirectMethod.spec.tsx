/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { ModuleDirectMethod } from './moduleDirectMethod';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
const pathname = '#/devices/deviceDetail/moduleIdentity/moduleTwin/?deviceId=newdevice&moduleId=moduleId';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ search: '?deviceId=newdevice&moduleId=moduleId', pathname }),
}));

describe('moduleDirectMethod', () => {
    it('matches snapshot', () => {
        expect(render(<MemoryRouter><ModuleDirectMethod /></MemoryRouter>)).toBeDefined();
    });
});