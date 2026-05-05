/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConnectionStringsView } from './connectionStringsView';
import * as connectionStringContext from '../context/connectionStringStateContext';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

const mockGetConnectionStrings = jest.fn();

jest.mock('../context/connectionStringStateContext', () => ({
    useConnectionStringContext: jest.fn()
}));

jest.mock('../../navigation/hooks/useBreadcrumbEntry', () => ({
    useBreadcrumbEntry: jest.fn()
}));

jest.mock('../../authentication/context/authenticationStateContext', () => ({
    useAuthenticationStateContext: () => [
        {},
        { setLoginPreference: jest.fn(), getLoginPreference: jest.fn() }
    ]
}));

describe('ConnectionStringsView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (connectionStringContext.useConnectionStringContext as jest.Mock).mockReturnValue([
            { payload: [], synchronizationStatus: 'fetched' },
            { setConnectionStrings: jest.fn(), upsertConnectionString: jest.fn(), deleteConnectionString: jest.fn(), getConnectionStrings: mockGetConnectionStrings }
        ]);
    });

    it('calls getConnectionStrings on mount', () => {
        render(<MemoryRouter><ConnectionStringsView/></MemoryRouter>);
        expect(mockGetConnectionStrings).toHaveBeenCalled();
    });

    it('renders empty state when payload is empty', () => {
        render(<MemoryRouter><ConnectionStringsView/></MemoryRouter>);
        expect(screen.getByText('connectionStrings.empty.header')).toBeInTheDocument();
    });

    it('renders add command bar button', () => {
        render(<MemoryRouter><ConnectionStringsView/></MemoryRouter>);
        expect(screen.getByText('connectionStrings.addConnectionCommand.label')).toBeInTheDocument();
    });

    it('renders connection string items when payload has entries', () => {
        (connectionStringContext.useConnectionStringContext as jest.Mock).mockReturnValue([
            {
                payload: [
                    { connectionString: 'HostName=hub1.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key1', expiration: new Date(Date.now() + 365 * 86400000).toISOString() }
                ],
                synchronizationStatus: 'fetched'
            },
            { setConnectionStrings: jest.fn(), upsertConnectionString: jest.fn(), deleteConnectionString: jest.fn(), getConnectionStrings: mockGetConnectionStrings }
        ]);

        render(<MemoryRouter><ConnectionStringsView/></MemoryRouter>);

        // Should show the resource name from the host name
        expect(screen.getByText('hub1')).toBeInTheDocument();
        // Should NOT show empty state
        expect(screen.queryByText('connectionStrings.empty.header')).toBeNull();
    });
});
