/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import { ModuleIdentityDetailComponent, ModuleIdentityDetailDataProps, ModuleIdentityDetailDispatchProps } from './moduleIdentityDetail';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const pathname = 'http://127.0.0.1:3000/#/resources/testhub.azure-devices.net/devices/deviceDetail/moduleIdentity/moduleDetail/?deviceId=newdevice&moduleId=moduleId';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?deviceId=newdevice&moduleId=moduleId', pathname }),
}));

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
        ...overrides
    };
    return <ModuleIdentityDetailComponent {...props} />;
};

describe('devices/components/moduleIdentityDetail', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });

        const deviceId = 'deviceId';
        const moduleId = 'moduleId';
        it('matches snapshot after module identity is fetched', () => {
            expect(shallow(getComponent({
                moduleIdentity: {
                    authentication: null,
                    deviceId,
                    moduleId
                },
                moduleIdentitySyncStatus: SynchronizationStatus.fetched
            }))).toMatchSnapshot();

            expect(shallow(getComponent({
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
            }))).toMatchSnapshot();

            expect(shallow(getComponent({
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
            }))).toMatchSnapshot();

            expect(shallow(getComponent({
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
            }))).toMatchSnapshot();
        });
    });
});
