/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { DeviceContentComponent, DeviceContentDispatchProps, DeviceContentProps } from './deviceContent';
import { testSnapshot } from '../../../shared/utils/testHelpers';

describe('deviceContent', () => {

    const pathname = `/#/devices/detail/?id=testDevice`;

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
    const deviceContentProps: DeviceContentProps = {
        deviceId: 'testDevice',
        identityWrapper: null,
        interfaceId: 'testInterfaceId',
        interfaceIds: [],
        isLoading: false,
        isPnPDevice: true,
    };

    const deviceContentDispatchProps: DeviceContentDispatchProps = {
        getDeviceIdentity: jest.fn(),
        getDigitalTwinInterfaceProperties: jest.fn(),
        setInterfaceId: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceContentProps,
            ...deviceContentDispatchProps,
            ...routerprops,
            ...overrides
        };

        return (
            <DeviceContentComponent {...props} />
        );
    };

    it('matches snapshot', () => {
        testSnapshot(getComponent());
    });
});
