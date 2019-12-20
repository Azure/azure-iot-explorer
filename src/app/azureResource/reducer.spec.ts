/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceStateInterface } from './state';
import { setActiveAzureResourceAction } from './actions';
import { AzureResource } from './models/azureResource';;
import reducer from './reducer';
import { AccessVerificationState } from './models/accessVerificationState';

describe('setActiveAzureResourceAction', () => {
    it('sets entire azure resource', () => {
        const initialState: AzureResourceStateInterface = {
            activeAzureResource: undefined
        };

        const resource: AzureResource = {
            accessVerificationState: AccessVerificationState.Authorized,
            connectionString: 'connection',
            hostName: 'hostName'
        };
        const action =  setActiveAzureResourceAction(resource);
        const result = reducer(initialState, action);

        expect(result.activeAzureResource).toEqual(resource);
    });
});
