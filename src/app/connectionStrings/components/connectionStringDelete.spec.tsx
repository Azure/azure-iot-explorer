/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionStringDelete, ConnectionStringDeleteProps } from './connectionStringDelete';

describe('ConnectionStringDelete', () => {
    const baseProps: ConnectionStringDeleteProps = {
        connectionString: 'HostName=test.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=key123',
        hidden: false,
        onDeleteCancel: jest.fn(),
        onDeleteConfirm: jest.fn(),
    };

    beforeEach(() => jest.clearAllMocks());

    it('does not render dialog content when hidden', () => {
        render(<ConnectionStringDelete {...baseProps} hidden={true}/>);
        expect(screen.queryByText('connectionStrings.deleteConnection.title')).toBeNull();
    });

    it('renders dialog with title and body when visible', () => {
        render(<ConnectionStringDelete {...baseProps}/>);
        expect(screen.getByText('connectionStrings.deleteConnection.title')).toBeInTheDocument();
        expect(screen.getByText('connectionStrings.deleteConnection.body')).toBeInTheDocument();
    });

    it('shows the connection string in a readonly textarea', () => {
        render(<ConnectionStringDelete {...baseProps}/>);
        const textarea = screen.getByLabelText('connectionStrings.deleteConnection.input') as HTMLTextAreaElement;
        expect(textarea.value).toBe(baseProps.connectionString);
        expect(textarea.readOnly).toBe(true);
    });

    it('calls onDeleteConfirm when confirm button is clicked', () => {
        const onDeleteConfirm = jest.fn();
        render(<ConnectionStringDelete {...baseProps} onDeleteConfirm={onDeleteConfirm}/>);

        fireEvent.click(screen.getByText('connectionStrings.deleteConnection.yes.label'));
        expect(onDeleteConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onDeleteCancel when cancel button is clicked', () => {
        const onDeleteCancel = jest.fn();
        render(<ConnectionStringDelete {...baseProps} onDeleteCancel={onDeleteCancel}/>);

        fireEvent.click(screen.getByText('connectionStrings.deleteConnection.no.label'));
        expect(onDeleteCancel).toHaveBeenCalledTimes(1);
    });
});