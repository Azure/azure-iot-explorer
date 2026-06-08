/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeviceIdentityCommandBar } from './deviceIdentityCommandBar';

describe('DeviceIdentityCommandBar', () => {
    const defaultProps = {
        connectionString: 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=',
        handleSave: jest.fn(),
    };

    beforeEach(() => jest.clearAllMocks());

    it('renders save button', () => {
        render(<DeviceIdentityCommandBar {...defaultProps}/>);

        expect(screen.getByText('deviceIdentity.commands.save')).toBeInTheDocument();
    });

    it('renders manage keys menu button', () => {
        render(<DeviceIdentityCommandBar {...defaultProps}/>);

        expect(screen.getByText('deviceIdentity.commands.manageKeys.label')).toBeInTheDocument();
    });

    it('disables save button when disableSave is true', () => {
        render(<DeviceIdentityCommandBar {...defaultProps} disableSave={true}/>);

        const saveButton = screen.getByLabelText('deviceIdentity.commands.save');
        expect((saveButton as HTMLButtonElement).disabled).toBe(true);
    });

    it('calls handleSave when save button is clicked', () => {
        const handleSave = jest.fn();
        render(<DeviceIdentityCommandBar {...defaultProps} handleSave={handleSave}/>);

        fireEvent.click(screen.getByText('deviceIdentity.commands.save'));
        expect(handleSave).toHaveBeenCalledTimes(1);
    });
});
