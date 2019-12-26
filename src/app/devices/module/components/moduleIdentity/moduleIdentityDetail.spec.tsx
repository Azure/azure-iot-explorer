/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import ModuleIdentityDetailComponent, { ModuleIdentityDetailDataProps, ModuleIdentityDetailDispatchProps } from './moduleIdentityDetail';
import { testSnapshot } from '../../../../shared/utils/testHelpers';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ModuleTwin } from '../../../../api/models/moduleTwin';

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

const moduleIdentityDataProps: ModuleIdentityDetailDataProps = {
    moduleIdentity: null,
    moduleIdentitySyncStatus: SynchronizationStatus.working,
    moduleIdentityTwin: null,
    moduleIdentityTwinSyncStatus: SynchronizationStatus.working
};

const mockGetModuleIdentityTwin = jest.fn();
const mockGetModuleIdentity = jest.fn();
const moduleIdentityDispatchProps: ModuleIdentityDetailDispatchProps = {
    getModuleIdentity: mockGetModuleIdentity,
    getModuleIdentityTwin: mockGetModuleIdentityTwin
};

const getComponent = (overrides = {}) => {
    const props = {
        ...moduleIdentityDataProps,
        ...moduleIdentityDispatchProps,
        ...routerprops,
        ...overrides
    };
    return <ModuleIdentityDetailComponent {...props} />;
};

describe('devices/components/moduleIdentityRoutes', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            testSnapshot(getComponent());
        });
    });

    context('snapshot', () => {
        it('matches snapshot after fetched', () => {
            // tslint:disable
            const moduleIdentityTwin: ModuleTwin = {
                deviceId: 'deviceId',
                moduleId: 'moduleId',
                etag: 'AAAAAAAAAAE=',
                deviceEtag: 'AAAAAAAAAAE=',
                status: 'enabled',
                statusUpdateTime: '0001-01-01T00:00:00Z',
                lastActivityTime: '0001-01-01T00:00:00Z',
                x509Thumbprint:  {primaryThumbprint: null, secondaryThumbprint: null},
                version: 1,
                connectionState: 'Disconnected',
                cloudToDeviceMessageCount: 0,
                authenticationType:'sas',
                properties: {}
            }
            // tslint:enable
            testSnapshot(getComponent({
                moduleIdentityTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            }));
        });
    });
});
