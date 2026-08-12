/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { DeviceSimulationPanel } from './deviceSimulationPanel';

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ResourceKeys } from '../../../../localization/resourceKeys';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ search: `?deviceId=device1` })
}));

describe('deviceSimulationPanel', () => {
        it('matches snapshot ', () => {
            expect(render(<MemoryRouter><DeviceSimulationPanel showSimulationPanel={true}
                onToggleSimulationPanel={jest.fn()}/></MemoryRouter>)).toBeDefined();
        });

        it('gives the event body textarea an accessible name', () => {
            render(<MemoryRouter><DeviceSimulationPanel showSimulationPanel={true}
                onToggleSimulationPanel={jest.fn()}/></MemoryRouter>);

            // The advanced section holding the event body starts collapsed.
            fireEvent.click(screen.getByRole('button', {
                name: `collapsibleSection.open ${ResourceKeys.deviceEvents.simulation.advanced.label}`
            }));

            const textarea = screen.getByLabelText(ResourceKeys.deviceEvents.simulation.advanced.body.label);
            expect(textarea.tagName).toEqual('TEXTAREA');
        });
});