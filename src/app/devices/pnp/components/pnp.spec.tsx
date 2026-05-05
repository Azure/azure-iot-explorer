/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Pnp } from './pnp';

import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
const search = '?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1;1';
const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/${search}`;
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' }),

}));

describe('pnp', () => {
    it('matches snapshot', async () => {
        await act(async () => {
            expect(render(<MemoryRouter><Pnp /></MemoryRouter>)).toBeDefined();
        });
    });
});