/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import DeviceTwin from './deviceTwin';
import { testSnapshot } from '../../../../shared/utils/testHelpers';

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
const dispatchProps = {
    getDeviceTwin: jest.fn(),
    updateDeviceTwin: jest.fn(),
};

const getComponent = (overrides = {}) => {
    const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
    const props = {
        connectionString,
        ...routerprops,
        ...overrides,
        ...dispatchProps
    };
    return <DeviceTwin {...props} />;
};

describe('devices/components/deviceTwin', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            testSnapshot(getComponent());
        });
        it('matches snapshot while loading twin', () => {
            testSnapshot(getComponent({
                isloading: true
            }));
        });
        it('matches snapshot with twin', () => {
            testSnapshot(getComponent({
                twin: {}
            }));
        });
    });
});
