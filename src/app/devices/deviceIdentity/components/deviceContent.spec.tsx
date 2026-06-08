/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { DeviceContent } from './deviceContent';

import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
const pathname = '/#/devices/detail/?id=testDevice';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '?id=testDevice', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),

}));

describe('deviceContent', () => {
    it('matches snapshot', async () => {
        await act(async () => {
            expect(render(<MemoryRouter><DeviceContent /></MemoryRouter>)).toBeDefined();
        });
    });
});