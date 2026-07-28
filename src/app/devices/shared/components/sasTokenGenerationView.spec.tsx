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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    it('keeps the selected key and a committed expiration value', async () => {
        const user = userEvent.setup();
        const generateSpy = jest.spyOn(deviceIdentityHelper, 'generateSASTokenConnectionStringForModuleIdentity')
            .mockReturnValue('connection-string');
        render(getComponent({ moduleIdentity }));

        await user.click(screen.getByTitle('collapsibleSection.open'));
        const keyDropdown = screen.getByRole('combobox', {
            name: 'deviceIdentity.authenticationType.sasToken.symmetricKey'
        });
        await user.click(keyDropdown);
        await user.click(screen.getByRole('option', {
            name: 'deviceIdentity.authenticationType.symmetricKey.primaryKey'
        }));

        const expiration = screen.getByRole('spinbutton', {
            name: 'deviceIdentity.authenticationType.sasToken.expiration'
        });
        await user.clear(expiration);
        await user.type(expiration, '60');
        await user.keyboard('{Enter}');

        expect(expiration).toHaveValue('60');
        expect(keyDropdown.textContent).toContain('deviceIdentity.authenticationType.symmetricKey.primaryKey');

        await user.click(screen.getByRole('button', {
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

    it('rejects an expiration value below one minute', async () => {
        const user = userEvent.setup();
        render(getComponent({ moduleIdentity }));

        await user.click(screen.getByTitle('collapsibleSection.open'));
        const expiration = screen.getByRole('spinbutton', {
            name: 'deviceIdentity.authenticationType.sasToken.expiration'
        });
        await user.clear(expiration);
        await user.type(expiration, '0');
        await user.keyboard('{Enter}');

        expect(expiration).toHaveValue(SAS_EXPIRES_MINUTES.toString());
    });
});
