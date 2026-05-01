/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConnectionString, ConnectionStringProps } from './connectionString';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('ConnectionString', () => {
    const testConnectionString = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=abc123';
    const defaultProps: ConnectionStringProps = {
        connectionStringWithExpiry: { connectionString: testConnectionString, expiration: new Date(Date.now() + 365 * 86400000).toISOString() },
        onEditConnectionString: jest.fn(),
        onDeleteConnectionString: jest.fn(),
        onSelectConnectionString: jest.fn()
    };

    beforeEach(() => jest.clearAllMocks());

    it('renders resource name derived from host name', () => {
        render(<MemoryRouter><ConnectionString {...defaultProps}/></MemoryRouter>);

        expect(screen.getByText('test')).toBeDefined();
    });

    it('renders edit and delete buttons', () => {
        render(<MemoryRouter><ConnectionString {...defaultProps}/></MemoryRouter>);

        expect(screen.getByLabelText('connectionStrings.editConnectionCommand.ariaLabel')).toBeDefined();
        expect(screen.getByLabelText('connectionStrings.deleteConnectionCommand.ariaLabel')).toBeDefined();
    });

    it('calls onEditConnectionString when edit button is clicked', () => {
        const onEdit = jest.fn();
        render(<MemoryRouter><ConnectionString {...defaultProps} onEditConnectionString={onEdit}/></MemoryRouter>);

        fireEvent.click(screen.getByLabelText('connectionStrings.editConnectionCommand.ariaLabel'));
        expect(onEdit).toHaveBeenCalledWith(testConnectionString);
    });

    it('renders visit button that calls onSelectConnectionString', () => {
        const onSelect = jest.fn();
        render(<MemoryRouter><ConnectionString {...defaultProps} onSelectConnectionString={onSelect}/></MemoryRouter>);

        const visitButton = screen.getByText('connectionStrings.visitConnectionCommand.label');
        fireEvent.click(visitButton);
        expect(onSelect).toHaveBeenCalledWith(testConnectionString);
    });

    it('clicking resource name link calls onSelectConnectionString', () => {
        const onSelect = jest.fn();
        render(<MemoryRouter><ConnectionString {...defaultProps} onSelectConnectionString={onSelect}/></MemoryRouter>);

        fireEvent.click(screen.getByText('test'));
        expect(onSelect).toHaveBeenCalledWith(testConnectionString);
    });

    it('opens delete confirmation dialog when delete button is clicked', () => {
        render(<MemoryRouter><ConnectionString {...defaultProps}/></MemoryRouter>);

        // Initially dialog should not be open
        expect(screen.queryByText('connectionStrings.deleteConnection.title')).toBeNull();

        fireEvent.click(screen.getByLabelText('connectionStrings.deleteConnectionCommand.ariaLabel'));

        // Dialog should now be visible
        expect(screen.getByText('connectionStrings.deleteConnection.title')).toBeDefined();
    });

    it('renders connection string properties labels', () => {
        render(<MemoryRouter><ConnectionString {...defaultProps}/></MemoryRouter>);

        expect(screen.getByText('connectionStrings.properties.hostName.label')).toBeDefined();
        expect(screen.getByText('connectionStrings.properties.sharedAccessPolicyName.label')).toBeDefined();
        expect(screen.getByText('connectionStrings.properties.sharedAccessPolicyKey.label')).toBeDefined();
        expect(screen.getByText('connectionStrings.properties.connectionString.label')).toBeDefined();
    });
});
