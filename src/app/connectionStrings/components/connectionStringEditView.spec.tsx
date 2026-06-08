/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionStringEditView, ConnectionStringEditViewProps } from './connectionStringEditView';

describe('ConnectionStringEditView', () => {
    const baseProps: ConnectionStringEditViewProps = {
        connectionStringUnderEdit: '',
        connectionStrings: [],
        onDismiss: jest.fn(),
        onCommit: jest.fn()
    };

    beforeEach(() => jest.clearAllMocks());

    it('renders add mode title when connectionStringUnderEdit is empty', () => {
        render(<ConnectionStringEditView {...baseProps}/>);

        expect(screen.getByText('connectionStrings.editConnection.title.add')).toBeInTheDocument();
    });

    it('renders edit mode title when connectionStringUnderEdit is provided', () => {
        const props = {
            ...baseProps,
            connectionStringUnderEdit: 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=abc123'
        };
        render(<ConnectionStringEditView {...props}/>);

        expect(screen.getByText('connectionStrings.editConnection.title.edit')).toBeInTheDocument();
    });

    it('renders textarea with correct placeholder and label', () => {
        render(<ConnectionStringEditView {...baseProps}/>);

        expect(screen.getByLabelText('connectionStrings.editConnection.editField.ariaLabel')).toBeInTheDocument();
        expect(screen.getByText('connectionStrings.editConnection.editField.label')).toBeInTheDocument();
    });

    it('renders save and cancel buttons', () => {
        render(<ConnectionStringEditView {...baseProps}/>);

        expect(screen.getByText('connectionStrings.editConnection.save.label')).toBeInTheDocument();
        expect(screen.getByText('connectionStrings.editConnection.cancel.label')).toBeInTheDocument();
    });

    it('renders external help link and warning text', () => {
        render(<ConnectionStringEditView {...baseProps}/>);

        expect(screen.getByText('connectivityPane.connectionStringComboBox.linkText')).toBeInTheDocument();
        expect(screen.getByText('connectivityPane.connectionStringComboBox.warning')).toBeInTheDocument();
    });

    it('calls onDismiss when cancel button is clicked', () => {
        const onDismiss = jest.fn();
        render(<ConnectionStringEditView {...baseProps} onDismiss={onDismiss}/>);

        fireEvent.click(screen.getByText('connectionStrings.editConnection.cancel.label'));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onCommit when save button is clicked with valid connection string', () => {
        const validCS = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=abc123';
        const onCommit = jest.fn();
        const props = { ...baseProps, connectionStringUnderEdit: validCS, onCommit };
        render(<ConnectionStringEditView {...props}/>);

        fireEvent.click(screen.getByText('connectionStrings.editConnection.save.label'));
        expect(onCommit).toHaveBeenCalledWith(validCS);
    });

    it('shows validation error for invalid connection string', () => {
        render(<ConnectionStringEditView {...baseProps}/>);

        const textarea = screen.getByLabelText('connectionStrings.editConnection.editField.ariaLabel');
        fireEvent.change(textarea, { target: { value: 'invalid-string' } });

        // Validation message should appear
        expect(screen.getByText('connectivityPane.connectionStringComboBox.errorMessages.invalid')).toBeInTheDocument();
    });

    it('shows duplicate validation error when connection string already exists', () => {
        const existingCS = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=abc123';
        const props = {
            ...baseProps,
            connectionStrings: [{ connectionString: existingCS, expiration: '' }]
        };
        render(<ConnectionStringEditView {...props}/>);

        const textarea = screen.getByLabelText('connectionStrings.editConnection.editField.ariaLabel');
        fireEvent.change(textarea, { target: { value: existingCS } });

        expect(screen.getByText('connectionStrings.editConnection.validations.duplicate')).toBeInTheDocument();
    });
});
