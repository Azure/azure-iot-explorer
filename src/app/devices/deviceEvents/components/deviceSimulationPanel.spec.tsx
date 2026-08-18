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

        it('does not dismiss the drawer on the first escape from the property key and value fields', () => {
            const onToggleSimulationPanel = jest.fn();
            render(<MemoryRouter><DeviceSimulationPanel showSimulationPanel={true}
                onToggleSimulationPanel={onToggleSimulationPanel}/></MemoryRouter>);

            fireEvent.click(screen.getByRole('button', {
                name: `collapsibleSection.open ${ResourceKeys.deviceEvents.simulation.advanced.label}`
            }));

            [
                ResourceKeys.deviceEvents.simulation.advanced.properties.key,
                ResourceKeys.deviceEvents.simulation.advanced.properties.value
            ].forEach(label => {
                const field = screen.getByLabelText(label);

                fireEvent.keyDown(field, { key: 'Escape' });
                expect(onToggleSimulationPanel).not.toHaveBeenCalled();

                fireEvent.keyDown(field, { key: 'Escape' });
                expect(onToggleSimulationPanel).toHaveBeenCalledTimes(1);

                onToggleSimulationPanel.mockClear();
                fireEvent.blur(field);
            });
        });

        it('still edits the property key and value after the escape guard is attached', () => {
            render(<MemoryRouter><DeviceSimulationPanel showSimulationPanel={true}
                onToggleSimulationPanel={jest.fn()}/></MemoryRouter>);

            fireEvent.click(screen.getByRole('button', {
                name: `collapsibleSection.open ${ResourceKeys.deviceEvents.simulation.advanced.label}`
            }));

            const keyField = screen.getByLabelText(ResourceKeys.deviceEvents.simulation.advanced.properties.key);
            const valueField = screen.getByLabelText(ResourceKeys.deviceEvents.simulation.advanced.properties.value);

            fireEvent.change(keyField, { target: { value: 'key1' } });
            fireEvent.change(valueField, { target: { value: 'value1' } });

            expect((screen.getByLabelText(ResourceKeys.deviceEvents.simulation.advanced.properties.key) as HTMLInputElement).value).toEqual('key1');
            expect((screen.getByLabelText(ResourceKeys.deviceEvents.simulation.advanced.properties.value) as HTMLInputElement).value).toEqual('value1');
        });
});