/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import DeviceIdentityCommandBar from './deviceIdentityCommandBar';
import { testSnapshot } from '../../../../shared/utils/testHelpers';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const pathname = `/`;

const location: any = { // tslint:disable-line:no-any
    pathname
};
const routerprops: any = { // tslint:disable-line:no-any
    history: {
        location
    },
    location,
    match: {}
};

const getComponent = (overrides = {}) => {
    const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
    const props = {
        connectionString,
        ...routerprops,
        ...overrides,
    };
    return <DeviceIdentityCommandBar {...props} />;
};

describe('devices/components/deviceIdentityCommandBar', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            testSnapshot(getComponent());
        });
        it('matches snapshot with disabled save', () => {
            testSnapshot(getComponent({
                disableSave: true
            }));
        });
    });
});
