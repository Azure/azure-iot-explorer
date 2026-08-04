/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { SasTokenGenerationView, SasTokenGenerationDataProps } from './sasTokenGenerationView';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import * as deviceIdentityHelper from '../../deviceIdentity/components/deviceIdentityHelper';
import { SAS_EXPIRES_MINUTES } from '../../../constants/devices';

import { fireEvent, render, screen } from '@testing-library/react';
const moduleIdentityTwinDataProps: SasTokenGenerationDataProps = {
    activeAzureResourceHostName: 'testHub.azure-devices.net'
};

const getComponent = (overrides = {}) => {
    const props = {
        ...moduleIdentityTwinDataProps,
        ...overrides
    };
    return <SasTokenGenerationView {...props} />;
};

const deviceId = 'testDevice';
const moduleId = 'testModule';
const moduleIdentity: ModuleIdentity = {
    authentication: {
        symmetricKey: {
            primaryKey: 'mock_key_1',
            secondaryKey: 'mock_key_2'
        },
        type: 'sas',
        x509Thumbprint: null
    },
    deviceId,
    moduleId
};

// tslint:disable
const deviceIdentity: DeviceIdentity = {
        authentication: { symmetricKey: { primaryKey: null, secondaryKey: null }, type: 'sas', x509Thumbprint: null },
        capabilities: { iotEdge: false },
        cloudToDeviceMessageCount: null,
        deviceId,
        etag: null,
        lastActivityTime: null,
        status: 'enabled',
        statusReason: null,
        statusUpdatedTime: null
    };
// tslint:enable

describe('devices/components/moduleIdentityTwin', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    context('snapshot', () => {
        it('matches snapshot when no device identity is provided', () => {
            const { container } = render(getComponent({
                deviceIdentity
            }));
        expect(container).toBeDefined();
        });

        it('matches snapshot when no device identity is provided', () => {
            const { container } = render(getComponent({
                moduleIdentity
            }));
        expect(container).toBeDefined();
        });
    });

    it('keeps the selected key and a committed expiration value', () => {
        const generateSpy = jest.spyOn(deviceIdentityHelper, 'generateSASTokenConnectionStringForModuleIdentity')
            .mockReturnValue('connection-string');
        render(getComponent({ moduleIdentity }));

        fireEvent.click(screen.getByTitle('collapsibleSection.open'));
        const keyDropdown = screen.getByRole('combobox', {
            name: 'deviceIdentity.authenticationType.sasToken.symmetricKey'
        });
        fireEvent.click(keyDropdown);
        fireEvent.click(screen.getByRole('option', {
            name: 'deviceIdentity.authenticationType.symmetricKey.primaryKey'
        }));

        const expiration = screen.getByRole('spinbutton', {
            name: 'deviceIdentity.authenticationType.sasToken.expiration'
        });
        fireEvent.change(expiration, { target: { value: '60' } });
        fireEvent.keyDown(expiration, { key: 'Enter' });

        expect(expiration).toHaveValue('60');
        expect(keyDropdown.textContent).toContain('deviceIdentity.authenticationType.symmetricKey.primaryKey');

        fireEvent.click(screen.getByRole('button', {
            name: 'deviceIdentity.authenticationType.sasToken.generateButton.text'
        }));
        expect(generateSpy).toHaveBeenCalledWith(
            moduleIdentityTwinDataProps.activeAzureResourceHostName,
            deviceId,
            moduleId,
            60,
            moduleIdentity.authentication.symmetricKey.primaryKey
        );
    });

    it('rejects an expiration value below one minute', () => {
        render(getComponent({ moduleIdentity }));

        fireEvent.click(screen.getByTitle('collapsibleSection.open'));
        const expiration = screen.getByRole('spinbutton', {
            name: 'deviceIdentity.authenticationType.sasToken.expiration'
        });
        fireEvent.change(expiration, { target: { value: '0' } });
        fireEvent.keyDown(expiration, { key: 'Enter' });

        expect(expiration).toHaveValue(SAS_EXPIRES_MINUTES.toString());
    });
});
