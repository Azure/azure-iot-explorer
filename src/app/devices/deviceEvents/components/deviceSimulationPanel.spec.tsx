/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { DeviceSimulationPanel } from './deviceSimulationPanel';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ search: `?deviceId=device1` })
}));

describe('deviceSimulationPanel', () => {
        it('matches snapshot ', () => {
            expect(render(<MemoryRouter><DeviceSimulationPanel showSimulationPanel={true}
                onToggleSimulationPanel={jest.fn()}/></MemoryRouter>)).toBeDefined();
        });
});