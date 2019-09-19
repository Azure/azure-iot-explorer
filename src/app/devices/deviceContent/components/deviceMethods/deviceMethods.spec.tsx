/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DeviceMethods, { DeviceMethodsProps } from './deviceMethods';
import { testSnapshot } from '../../../../shared/utils/testHelpers';

describe('deviceMethods', () => {
    const deviceMethodProps: DeviceMethodsProps = {
        connectionString: 'testString',
        deviceIdentityWrapper: {
            deviceIdentity: {
                authentication: {symmetricKey: {primaryKey: null, secondaryKey: null}, type: 'sas', x509Thumbprint: null},
                capabilities: {iotEdge: false},
                cloudToDeviceMessageCount: null,
                deviceId: 'deviceId',
                etag: null,
                lastActivityTime: null,
                status: 'enabled',
                statusReason: null,
                statusUpdatedTime: null
            },
            deviceIdentitySynchronizationStatus: undefined
        },
        getDeviceIdentity: jest.fn(),
        invokeMethodResponse: 'response',
        onInvokeMethodClick: jest.fn()
    };

    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location
        },
        location,
        match: {}
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceMethodProps,
            ...routerprops,
            ...overrides
        };

        return <DeviceMethods {...props} />;
    };

    it('matches snapshot', () => {
        const component = getComponent({
            settingSchema: undefined
        });
        testSnapshot(component);
    });
});
