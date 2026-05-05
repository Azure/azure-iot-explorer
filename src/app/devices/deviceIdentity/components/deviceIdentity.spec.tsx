/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DeviceIdentityInformation } from './deviceIdentity';
import * as IotHubContext from '../../../iotHub/hooks/useIotHubContext';

jest.mock('../../../iotHub/hooks/useIotHubContext', () => ({
    useIotHubContext: () => ({
        hostName: 'test.azure-devices.net',
        connectionString: 'HostName=test.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=key'
    })
}));

describe('DeviceIdentityInformation', () => {
    it('renders header text', () => {
        render(<DeviceIdentityInformation/>);

        expect(screen.getByText('deviceIdentity.headerText')).toBeInTheDocument();
    });

    it('renders device ID field label', () => {
        render(<DeviceIdentityInformation/>);

        expect(screen.getByText('deviceIdentity.deviceID')).toBeInTheDocument();
    });

    it('renders hub connectivity label', () => {
        render(<DeviceIdentityInformation/>);

        expect(screen.getByText('deviceIdentity.hubConnectivity.label')).toBeInTheDocument();
    });
});
