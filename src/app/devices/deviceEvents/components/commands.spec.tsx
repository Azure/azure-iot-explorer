/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Commands, CommandsProps } from './commands';
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

describe('Commands (non-PnP mode)', () => {
    const defaultProps: CommandsProps = {
        startDisabled: false,
        monitoringData: false,
        showPnpModeledEvents: false,
        showSimulationPanel: false,
        showContentTypePanel: false,
        setMonitoringData: jest.fn(),
        setShowPnpModeledEvents: jest.fn(),
        setShowSimulationPanel: jest.fn(),
        setShowContentTypePanel: jest.fn(),
        fetchData: jest.fn(),
        stopFetching: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (deviceEventsStateContext.useDeviceEventsStateContext as jest.Mock).mockReturnValue([
            { formMode: 'initialized' },
            { clearEventsMonitoring: jest.fn() }
        ]);
    });

    it('renders start monitoring button', () => {
        render(<MemoryRouter><Commands {...defaultProps}/></MemoryRouter>);

        expect(screen.getByText('deviceEvents.command.start')).toBeInTheDocument();
    });

    it('renders clear events button', () => {
        render(<MemoryRouter><Commands {...defaultProps}/></MemoryRouter>);

        expect(screen.getByText('deviceEvents.command.clearEvents')).toBeInTheDocument();
    });

    it('calls fetchData when start button is clicked', () => {
        const fetchData = jest.fn();
        const setMonitoringData = jest.fn();
        render(<MemoryRouter><Commands {...defaultProps} fetchData={fetchData} setMonitoringData={setMonitoringData}/></MemoryRouter>);

        fireEvent.click(screen.getByText('deviceEvents.command.start'));
        expect(fetchData).toHaveBeenCalled();
        expect(setMonitoringData).toHaveBeenCalledWith(true);
    });

    it('shows stop button and calls stopFetching when monitoring', () => {
        const stopFetching = jest.fn();
        const setMonitoringData = jest.fn();
        render(<MemoryRouter><Commands {...defaultProps} monitoringData={true} stopFetching={stopFetching} setMonitoringData={setMonitoringData}/></MemoryRouter>);

        expect(screen.getByText('deviceEvents.command.stop')).toBeInTheDocument();
        fireEvent.click(screen.getByText('deviceEvents.command.stop'));
        expect(stopFetching).toHaveBeenCalled();
    });

    it('renders simulation and content type buttons in non-PnP mode', () => {
        render(<MemoryRouter><Commands {...defaultProps}/></MemoryRouter>);

        expect(screen.getByText('deviceEvents.command.simulate')).toBeInTheDocument();
        expect(screen.getByText('deviceEvents.command.customizeContentType')).toBeInTheDocument();
    });
});
