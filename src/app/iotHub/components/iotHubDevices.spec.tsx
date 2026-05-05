/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IotHubDevices } from './iotHubDevices';

import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('IotHubDevices', () => {
    it('matches snapshot', async () => {
        await act(async () => {
            expect(render(<MemoryRouter><IotHubDevices /></MemoryRouter>)).toBeDefined();
        });
    });
});