/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CustomEventHub, CustomEventHubProps } from './customEventHub';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('CustomEventHub', () => {
    const defaultProps: CustomEventHubProps = {
        monitoringData: false,
        useBuiltInEventHub: true,
        customEventHubConnectionString: '',
        setUseBuiltInEventHub: jest.fn(),
        setCustomEventHubConnectionString: jest.fn(),
        setHasError: jest.fn()
    };

    beforeEach(() => jest.clearAllMocks());

    it('renders the switch label for default event hub', () => {
        render(<MemoryRouter><CustomEventHub {...defaultProps}/></MemoryRouter>);

        expect(screen.getByText('deviceEvents.toggleUseDefaultEventHub.label')).toBeInTheDocument();
    });

    it('does not show custom connection string input when useBuiltInEventHub is true', () => {
        render(<MemoryRouter><CustomEventHub {...defaultProps}/></MemoryRouter>);

        expect(screen.queryByText('deviceEvents.customEventHub.connectionString.label')).toBeNull();
    });

    it('shows custom connection string input when useBuiltInEventHub is false', () => {
        render(<MemoryRouter><CustomEventHub {...defaultProps} useBuiltInEventHub={false}/></MemoryRouter>);

        expect(screen.getByText('deviceEvents.customEventHub.connectionString.label')).toBeInTheDocument();
    });

    it('calls setUseBuiltInEventHub when switch is toggled', () => {
        const setUseBuiltInEventHub = jest.fn();
        render(<MemoryRouter><CustomEventHub {...defaultProps} setUseBuiltInEventHub={setUseBuiltInEventHub}/></MemoryRouter>);

        const switchEl = screen.getByRole('switch');
        fireEvent.click(switchEl);
        expect(setUseBuiltInEventHub).toHaveBeenCalledWith(false);
    });

    it('calls setCustomEventHubConnectionString when input changes', () => {
        const setCustomEventHubConnectionString = jest.fn();
        render(<MemoryRouter><CustomEventHub {...defaultProps} useBuiltInEventHub={false} setCustomEventHubConnectionString={setCustomEventHubConnectionString}/></MemoryRouter>);

        const input = screen.getByLabelText('deviceEvents.customEventHub.connectionString.label');
        fireEvent.change(input, { target: { value: 'Endpoint=sb://test.servicebus.windows.net/;SharedAccessKeyName=key;SharedAccessKey=abc;EntityPath=hub' } });
        expect(setCustomEventHubConnectionString).toHaveBeenCalled();
    });

    it('calls setHasError(true) for invalid custom connection string', () => {
        const setHasError = jest.fn();
        render(<MemoryRouter><CustomEventHub {...defaultProps} useBuiltInEventHub={false} customEventHubConnectionString="invalid" setHasError={setHasError}/></MemoryRouter>);

        expect(setHasError).toHaveBeenCalledWith(true);
    });
});
