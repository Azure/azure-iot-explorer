/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IotHub } from './iotHub';
import { MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('IotHub', () => {
    it('renders without error', () => {
        const { container } = render(<MemoryRouter><IotHub/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});