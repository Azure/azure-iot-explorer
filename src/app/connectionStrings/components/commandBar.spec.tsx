/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionStringCommandBar } from './commandBar';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import * as connectionStringContext from '../context/connectionStringStateContext';
import * as authenticationStateContext from '../../authentication/context/authenticationStateContext';

const mockSetLoginPreference = jest.fn();

jest.mock('../context/connectionStringStateContext', () => ({
    useConnectionStringContext: jest.fn()
}));

jest.mock('../../authentication/context/authenticationStateContext', () => ({
    useAuthenticationStateContext: jest.fn()
}));

describe('ConnectionStringCommandBar', () => {
    const mockOnAdd = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (connectionStringContext.useConnectionStringContext as jest.Mock).mockReturnValue([
            { payload: [], synchronizationStatus: 'fetched' },
            { setConnectionStrings: jest.fn(), upsertConnectionString: jest.fn(), deleteConnectionString: jest.fn(), getConnectionStrings: jest.fn() }
        ]);
        (authenticationStateContext.useAuthenticationStateContext as jest.Mock).mockReturnValue([
            {},
            { setLoginPreference: mockSetLoginPreference, getLoginPreference: jest.fn() }
        ]);
    });

    it('renders add and switch auth buttons', () => {
        render(<ConnectionStringCommandBar onAddConnectionStringClick={mockOnAdd}/>);

        expect(screen.getByText('connectionStrings.addConnectionCommand.label')).toBeInTheDocument();
        expect(screen.getByText('authentication.authSelection.switchAuthType')).toBeInTheDocument();
    });

    it('calls onAddConnectionStringClick when add button is clicked', () => {
        render(<ConnectionStringCommandBar onAddConnectionStringClick={mockOnAdd}/>);

        fireEvent.click(screen.getByText('connectionStrings.addConnectionCommand.label'));
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });

    it('calls setLoginPreference with empty string when switch auth is clicked', () => {
        render(<ConnectionStringCommandBar onAddConnectionStringClick={mockOnAdd}/>);

        fireEvent.click(screen.getByText('authentication.authSelection.switchAuthType'));
        expect(mockSetLoginPreference).toHaveBeenCalledWith('');
    });

    it('disables add button when payload is at max length', () => {
        (connectionStringContext.useConnectionStringContext as jest.Mock).mockReturnValue([
            { payload: Array.from({ length: CONNECTION_STRING_LIST_MAX_LENGTH }, (_, i) => ({ connectionString: `cs${i}` })), synchronizationStatus: 'fetched' },
            { setConnectionStrings: jest.fn(), upsertConnectionString: jest.fn(), deleteConnectionString: jest.fn(), getConnectionStrings: jest.fn() }
        ]);

        render(<ConnectionStringCommandBar onAddConnectionStringClick={mockOnAdd}/>);

        const addButton = screen.getByLabelText('connectionStrings.addConnectionCommand.ariaLabel');
        expect((addButton as HTMLButtonElement).disabled).toBe(true);
    });
});
