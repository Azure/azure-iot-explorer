/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventsContent } from './eventsContent';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/devices/detail/events/', search: '', hash: '', state: null, key: 'default' })
}));

jest.mock('../../pnp/context/pnpStateContext', () => ({
    usePnpStateContext: () => ({
        pnpState: { modelDefinitionWithSource: { payload: null } },
        getModelDefinition: jest.fn(),
        dispatch: jest.fn()
    })
}));

jest.mock('../context/deviceEventsStateContext', () => ({
    useDeviceEventsStateContext: jest.fn()
}));

describe('EventsContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty when no events exist', () => {
        (deviceEventsStateContext.useDeviceEventsStateContext as jest.Mock).mockReturnValue([
            { message: [] },
            jest.fn()
        ]);

        const { container } = render(<MemoryRouter><EventsContent showSystemProperties={false} showPnpModeledEvents={false}/></MemoryRouter>);

        expect(container.querySelectorAll('article').length).toBe(0);
    });

    it('renders raw events with timestamps and JSON body', () => {
        const testEvents = [
            {
                body: { temperature: 25 },
                enqueuedTime: '2024-01-01T00:00:00Z',
                systemProperties: { 'iothub-message-source': 'Telemetry' },
                properties: {}
            }
        ];

        (deviceEventsStateContext.useDeviceEventsStateContext as jest.Mock).mockReturnValue([
            { message: testEvents },
            jest.fn()
        ]);

        const { container } = render(<MemoryRouter><EventsContent showSystemProperties={false} showPnpModeledEvents={false}/></MemoryRouter>);

        expect(container.querySelectorAll('article').length).toBe(1);
        expect(screen.getByText('2024-01-01T00:00:00Z:')).toBeInTheDocument();
        expect(container.querySelector('pre').textContent).toContain('"temperature": 25');
    });

    it('renders multiple events', () => {
        const testEvents = [
            { body: { temp: 20 }, enqueuedTime: '2024-01-01T00:00:00Z', systemProperties: {}, properties: {} },
            { body: { temp: 30 }, enqueuedTime: '2024-01-02T00:00:00Z', systemProperties: {}, properties: {} }
        ];

        (deviceEventsStateContext.useDeviceEventsStateContext as jest.Mock).mockReturnValue([
            { message: testEvents },
            jest.fn()
        ]);

        const { container } = render(<MemoryRouter><EventsContent showSystemProperties={false} showPnpModeledEvents={false}/></MemoryRouter>);

        expect(container.querySelectorAll('article').length).toBe(2);
    });

    it('excludes systemProperties from rendered JSON when showSystemProperties is false', () => {
        const testEvents = [
            {
                body: { temperature: 25 },
                enqueuedTime: '2024-01-01T00:00:00Z',
                systemProperties: { 'iothub-message-source': 'Telemetry', 'iothub-connection-device-id': 'device1' },
                properties: { custom: 'value' }
            }
        ];

        (deviceEventsStateContext.useDeviceEventsStateContext as jest.Mock).mockReturnValue([
            { message: testEvents },
            jest.fn()
        ]);

        const { container } = render(<MemoryRouter><EventsContent showSystemProperties={false} showPnpModeledEvents={false}/></MemoryRouter>);

        const preContent = container.querySelector('pre').textContent;
        expect(preContent).toContain('"temperature": 25');
        expect(preContent).not.toContain('systemProperties');
        expect(preContent).not.toContain('iothub-connection-device-id');
    });

    it('includes systemProperties in rendered JSON when showSystemProperties is true', () => {
        const testEvents = [
            {
                body: { temperature: 25 },
                enqueuedTime: '2024-01-01T00:00:00Z',
                systemProperties: { 'iothub-message-source': 'Telemetry' },
                properties: {}
            }
        ];

        (deviceEventsStateContext.useDeviceEventsStateContext as jest.Mock).mockReturnValue([
            { message: testEvents },
            jest.fn()
        ]);

        const { container } = render(<MemoryRouter><EventsContent showSystemProperties={true} showPnpModeledEvents={false}/></MemoryRouter>);

        const preContent = container.querySelector('pre').textContent;
        expect(preContent).toContain('systemProperties');
    });
});
