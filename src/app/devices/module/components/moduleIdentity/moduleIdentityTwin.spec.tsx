/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import { ModuleIdentityDetailComponent, ModuleIdentityTwinDataProps, ModuleIdentityTwinDispatchProps } from './moduleIdentityTwin';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ModuleTwin } from '../../../../api/models/moduleTwin';

const pathname = 'http://127.0.0.1:3000/#/resources/testhub.azure-devices.net/devices/deviceDetail/moduleIdentity/moduleTwin/?deviceId=newdevice&moduleId=moduleId';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?deviceId=newdevice&moduleId=moduleId', pathname }),
}));

const moduleIdentityTwinDataProps: ModuleIdentityTwinDataProps = {
    moduleIdentityTwin: null,
    moduleIdentityTwinSyncStatus: SynchronizationStatus.working
};

const moduleIdentityTwinDispatchProps: ModuleIdentityTwinDispatchProps = {
    getModuleIdentityTwin: jest.fn()
};

const getComponent = (overrides = {}) => {
    const props = {
        ...moduleIdentityTwinDataProps,
        ...moduleIdentityTwinDispatchProps,
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

describe('devices/components/moduleIdentityTwin', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });

        it('matches snapshot after module twin is fetched', () => {
            expect(shallow(getComponent({
                moduleIdentityTwin,
                moduleIdentityTwinSyncStatus: SynchronizationStatus.fetched
            }))).toMatchSnapshot();
        });
    });
});
