/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import ModuleIdentityDetailComponent, { ModuleIdentityDetailDataProps, ModuleIdentityDetailDispatchProps } from './moduleIdentityDetail';
import { testSnapshot } from '../../../../shared/utils/testHelpers';
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
    moduleListSyncStatus: SynchronizationStatus.fetched
};

const moduleIdentityDispatchProps: ModuleIdentityDetailDispatchProps = {
    deleteModuleIdentity: jest.fn(),
    getModuleIdentity: jest.fn()
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

describe('devices/components/moduleIdentityDetail', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            testSnapshot(getComponent());
        });

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
                moduleIdentityTwinSyncStatus: SynchronizationStatus.fetched
            }));
        });
    });
});
