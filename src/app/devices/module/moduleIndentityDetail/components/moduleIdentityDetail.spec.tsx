/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import { ModuleIdentityDetail } from './moduleIdentityDetail';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import * as IotHubContext from '../../../../iotHub/hooks/useIotHubContext';

const pathname = 'http://127.0.0.1:3000/#/resources/testhub.azure-devices.net/devices/deviceDetail/moduleIdentity/moduleDetail/?deviceId=newdevice&moduleId=moduleId';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?deviceId=newdevice&moduleId=moduleId', pathname }),
}));

const deviceId = 'deviceId';
const moduleId = 'moduleId';
const moduleIdentityWithoutAuth = {
    authentication: null,
    deviceId,
    moduleId
};
const moduleIdentityWithSasAuth = {
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
};

const selfSignedModuleIdentity = {
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
};

const certificateAuthorityModuleIdentity = {
    authentication: {
        symmetricKey: null,
        type: 'certificateAuthority',
        x509Thumbprint: null
    },
    deviceId,
    moduleId
};

describe('ModuleIdentityDetail', () => {
    jest.spyOn(IotHubContext, 'useIotHubContext').mockReturnValue({ hostName: 'hostName'});

    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([{synchronizationStatus: SynchronizationStatus.working}, jest.fn()]);
            expect(shallow(<ModuleIdentityDetail/>)).toMatchSnapshot();
        });

        it('matches snapshot after module identity is fetched', () => {
            const initialState = {
                payload: moduleIdentityWithoutAuth,
                synchronizationStatus: SynchronizationStatus.fetched
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(shallow(<ModuleIdentityDetail/>)).toMatchSnapshot();
        });

        it('matches snapshot after sas module identity is fetched', () => {
            const initialState = {
                payload: moduleIdentityWithSasAuth,
                synchronizationStatus: SynchronizationStatus.fetched
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(shallow(<ModuleIdentityDetail/>)).toMatchSnapshot();
        });

        it('matches snapshot after self signed module identity is fetched', () => {
            const initialState = {
                payload: selfSignedModuleIdentity,
                synchronizationStatus: SynchronizationStatus.fetched
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(shallow(<ModuleIdentityDetail/>)).toMatchSnapshot();
        });

        it('matches snapshot after certificateAuthority module identity is fetched', () => {
            const initialState = {
                payload: certificateAuthorityModuleIdentity,
                synchronizationStatus: SynchronizationStatus.fetched
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(shallow(<ModuleIdentityDetail/>)).toMatchSnapshot();
        });

        it('matches snapshot showing delete confirmation', () => {
            const initialState = {
                payload: certificateAuthorityModuleIdentity,
                synchronizationStatus: SynchronizationStatus.fetched
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
            expect(shallow(<ModuleIdentityDetail/>)).toMatchSnapshot();
        });
    });
});
