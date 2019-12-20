/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    setActiveAzureResourceAction,
    setActiveAzureResourceByConnectionStringAction,
    SetActiveAzureResourceByConnectionStringActionParameters,
    setActiveAzureResourceByHostNameAction,
    SetActiveAzureResourceByHostNameActionParameters
} from './actions';
import { AzureResource } from './models/AzureResource';
import { AccessVerificationState } from './models/accessVerificationState';

describe('setActiveAzureResourceAction', () => {
    it('returns AZURE_RESOURCES/SET action object', () => {
        const azureResource: AzureResource = {
            accessVerificationState: AccessVerificationState.Verifying,
            hostName: 'hostName'
        };
        expect(setActiveAzureResourceAction(azureResource)).toEqual({
            payload: azureResource,
            type: 'AZURE_RESOURCES/SET'
        });
    });
});

describe('setActiveAzureResourceByConnectionStringAction', () => {
    it('returns AZURE_RESOURCES/SET_CONNECTION action object', () => {
        const parameters: SetActiveAzureResourceByConnectionStringActionParameters = {
            connectionString: 'connectionstring',
            hostName: 'hostName'
        };
        expect(setActiveAzureResourceByConnectionStringAction(parameters)).toEqual({
            payload: parameters,
            type: 'AZURE_RESOURCES/SET_CONNECTION'
        });
    });
});

describe('setActiveAzureResourceByHostNameAction', () => {
    it('returns AZURE_RESOURCES/SET_CONNECTION action object', () => {
        const parameters: SetActiveAzureResourceByHostNameActionParameters = {
            hostName: 'hostName'
        };
        expect(setActiveAzureResourceByHostNameAction(parameters)).toEqual({
            payload: parameters,
            type: 'AZURE_RESOURCES/SET_HOST'
        });
    });
});
