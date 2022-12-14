/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import { ModuleIdentityTwin } from './moduleIdentityTwin';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import { moduleTwinStateInitial } from '../state';

const pathname = 'https://127.0.0.1:3000/#/resources/testhub.azure-devices.net/devices/deviceDetail/moduleIdentity/moduleTwin/?deviceId=newdevice&moduleId=moduleId';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?deviceId=newdevice&moduleId=moduleId', pathname }),
}));

const moduleIdentityTwin: ModuleTwin = {
    authenticationType:'sas',
    cloudToDeviceMessageCount: 0,
    connectionState: 'Disconnected',
    deviceEtag: 'AAAAAAAAAAE=',
    deviceId: 'deviceId',
    etag: 'AAAAAAAAAAE=',
    lastActivityTime: '0001-01-01T00:00:00Z',
    moduleId: 'moduleId',
    properties: {},
    status: 'enabled',
    statusUpdateTime: '0001-01-01T00:00:00Z',
    version: 1,
    x509Thumbprint:  {primaryThumbprint: null, secondaryThumbprint: null},
};

const initialState = {
    ...moduleTwinStateInitial(),
    payload: moduleIdentityTwin
};

describe('moduleIdentityTwin', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{ synchronizationStatus: SynchronizationStatus.working }, jest.fn()]);
            expect(shallow(<ModuleIdentityTwin/>)).toMatchSnapshot();
        });

        it('matches snapshot after module twin is fetched', () => {
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([initialState, jest.fn()]);
            expect(shallow(<ModuleIdentityTwin/>)).toMatchSnapshot();
        });
    });
});
