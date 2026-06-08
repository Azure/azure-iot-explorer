/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { DeviceModules } from './deviceModules';

import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '?moduleId=mod1', hash: '', state: null, key: 'default' }),

}));


describe('DeviceModules', () => {
    it('matches snapshot', async () => {
        await act(async () => {
            expect(render(<MemoryRouter><DeviceModules /></MemoryRouter>)).toBeDefined();
        });
    });
});