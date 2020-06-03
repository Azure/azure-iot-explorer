/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { select, call } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { getActiveAzureResourceConnectionStringSaga, getActiveAzureResource, getAuthMode } from './getActiveAzureResourceConnectionStringSaga';
import { appConfig, AuthMode } from '../../../appConfig/appConfig';
import { AzureResourceIdentifierType } from '../../azureResourceIdentifier/models/azureResourceIdentifierType';
import { getConnectionStringFromIotHubSaga } from '../../iotHub/sagas/getConnectionStringFromIotHubSaga';

describe('getActiveAzureResourceConnectionStringSaga', () => {
    const getActiveAzureResourceConnectionStringSagaGenerator = cloneableGenerator(getActiveAzureResourceConnectionStringSaga)();

    it('yields select effect to get active resource', () => {
        expect(getActiveAzureResourceConnectionStringSagaGenerator.next()).toEqual({
            done: false,
            value: select(getActiveAzureResource)
        });
        getActiveAzureResourceConnectionStringSagaGenerator.next();
    });

    describe('azure resource undefined', () => {
        const saga = getActiveAzureResourceConnectionStringSagaGenerator.clone();
        it('finishes with return value of empty string', () => {
            saga.next(); // calls the selector function
            expect(saga.next(undefined)).toEqual({
                done: true,
                value: ''
            });
        });
    });

    describe('azure resource defined - connection string', () => {
        const saga = getActiveAzureResourceConnectionStringSagaGenerator.clone();
        const azureResource = {
            connectionString: 'connectionString',
            hostName: 'hub1'
        };

        saga.next(); // calls the selector function

        it('yields call to getAuthMode', () => {
            expect(saga.next(azureResource)).toEqual({
                done: false,
                value: call(getAuthMode)
            });
        });

        it('finishes with return value of connectionString', () => {
            expect(saga.next(AuthMode.ConnectionString)).toEqual({
                done: true,
                value: azureResource.connectionString
            });
        });
    });

    describe('azure resource defined -- sso auth flow', () => {
        const saga = getActiveAzureResourceConnectionStringSagaGenerator.clone();
        const azureResource = {
            azureResourceIdentifier: {
                id: 'id1',
                location: 'location1',
                name: 'name1',
                resourceGroup: 'resourceGroup1',
                subscriptionId: 'sub1',
                type: AzureResourceIdentifierType.IotHub
            },
            hostName: 'hub1'
        };

        saga.next(); // calls the selector function

        it('yields call to getAuthMode', () => {
            expect(saga.next(azureResource)).toEqual({
                done: false,
                value: call(getAuthMode)
            });
        });

        it('yields call to getConnectionStringFromIotHubSaga', () => {
            expect(saga.next(AuthMode.ImplicitFlow)).toEqual({
                done: false,
                value: call(getConnectionStringFromIotHubSaga, azureResource.azureResourceIdentifier)
            });
        });

        it('finishes by returning the connection string', () => {
            expect(saga.next('connectionString1')).toEqual({
                done: true,
                value: 'connectionString1'
            });
        });
    });

    describe('azure resource defined - sso but unmapped resource identifier type', () => {
        const saga = getActiveAzureResourceConnectionStringSagaGenerator.clone();
        const azureResource = {
            azureResourceIdentifier: {
                id: 'id1',
                location: 'location1',
                name: 'name1',
                resourceGroup: 'resourceGroup1',
                subscriptionId: 'sub1',
                type: AzureResourceIdentifierType.DeviceProvisioningService
            },
            hostName: 'dps1'
        };

        saga.next(); // calls the selector function

        it('yields call to getAuthMode', () => {
            expect(saga.next(azureResource)).toEqual({
                done: false,
                value: call(getAuthMode)
            });
        });

        it('finishes by returning empty  connection string', () => {
            expect(saga.next(AuthMode.ImplicitFlow)).toEqual({
                done: true,
                value: ''
            });
        });
    });
});

describe('getAuthMode', () => {
    it('returns expected value', () => {
        const authMode = appConfig.authMode;
        expect(getAuthMode()).toEqual(authMode);
    });
});

describe('getActiveAzureResource', () => {
    it('returns expected value', () => {
        const state = {
            azureResourceState: {
                activeAzureResource: 'activeAzureResource'
            }
        };

        // tslint:disable-next-line:no-any
        expect(getActiveAzureResource(state as any)).toEqual('activeAzureResource');
    });
});
