/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import { SasTokenGenerationView, SasTokenGenerationDataProps } from './sasTokenGenerationView';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';

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
    context('snapshot', () => {
        it('matches snapshot when no device identity is provided', () => {
            expect(shallow(getComponent({
                deviceIdentity
            }))).toMatchSnapshot();
        });

        it('matches snapshot when no device identity is provided', () => {
            expect(shallow(getComponent({
                moduleIdentity
            }))).toMatchSnapshot();
        });
    });
});
