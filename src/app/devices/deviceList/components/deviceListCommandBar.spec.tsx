/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { DeviceListCommandBar } from './deviceListCommandBar';

import { render } from '@testing-library/react';
describe('deviceListCommandBar', () => {
    it('matches snapshot', () => {
        expect(render(<DeviceListCommandBar
            handleAdd={jest.fn}
            handleRefresh={jest.fn}
            handleDelete={jest.fn}
        />)).toBeDefined();
    });
});
