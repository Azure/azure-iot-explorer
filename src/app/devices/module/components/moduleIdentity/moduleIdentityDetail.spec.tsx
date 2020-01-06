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
    match: {
        params: {
            hostName: 'hostName'
        },
        url: 'http://127.0.0.1:3000/#/resources/testhub.azure-devices.net/devices/deviceDetail/moduleIdentity/moduleDetail/?deviceId=newdevice&moduleId=moduleId',
    } as any // tslint:disable-line:no-any
};

const moduleIdentityDataProps: ModuleIdentityDetailDataProps = {
    currentHostName: 'testhub.azure-devices.net',
    moduleIdentity: null,
    moduleIdentitySyncStatus: SynchronizationStatus.working,
    moduleIdentityTwin: null,
    moduleIdentityTwinSyncStatus: SynchronizationStatus.working,
    moduleListSyncStatus: SynchronizationStatus.fetched
};

const moduleIdentityDispatchProps: ModuleIdentityDetailDispatchProps = {
    deleteModuleIdentity: jest.fn(),
    getModuleIdentity: jest.fn(),
    getModuleIdentityTwin: jest.fn()
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

describe('devices/components/moduleIdentityRoutes', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            testSnapshot(getComponent());
        });
    });

    context('snapshot', () => {
        it('matches snapshot after module twin is fetched', () => {
            testSnapshot(getComponent({
                moduleIdentityTwin,
                moduleIdentityTwinSyncStatus: SynchronizationStatus.fetched
            }));
        });
    });

    context('snapshot', () => {
        const deviceId = 'deviceId';
        const moduleId = 'moduleId';
        it('matches snapshot after module identity is fetched', () => {
            testSnapshot(getComponent({
                moduleIdentity: {
                    authentication: null,
                    deviceId,
                    moduleId
                },
                moduleIdentitySyncStatus: SynchronizationStatus.fetched
            }));

            testSnapshot(getComponent({
                moduleIdentity: {
                    authentication: {
                        symmetricKey: {
                            primaryKey: 'key1',
                            secondaryKey: 'key2'
                        },
                        type: 'sas',
                        x509Thumbprint: null
                    },
                    deviceId,
                    moduleId
                },
                moduleIdentitySyncStatus: SynchronizationStatus.fetched
            }));

            testSnapshot(getComponent({
                moduleIdentity: {
                    authentication: {
                        symmetricKey: null,
                        type: 'selfSigned',
                        x509Thumbprint: {
                            primaryThumbprint: 'thumbprint1',
                            secondaryThumbprint: 'thumbprint2'
                        }
                    },
                    deviceId,
                    moduleId
                },
                moduleIdentitySyncStatus: SynchronizationStatus.fetched
            }));

            testSnapshot(getComponent({
                moduleIdentity: {
                    authentication: {
                        symmetricKey: null,
                        type: 'certificateAuthority',
                        x509Thumbprint: null
                    },
                    deviceId,
                    moduleId
                },
                moduleIdentitySyncStatus: SynchronizationStatus.fetched,
                moduleIdentityTwin,
                moduleIdentityTwinSyncStatus: SynchronizationStatus.fetched
            }));
        });
    });
});
