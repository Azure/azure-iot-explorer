/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import {
    getActiveAzureResourceSelector,
    getActiveAzureResourceHostNameSelector,
    getActiveAzureResourceConnectionStringSelector
} from './selectors';

describe('getAzureResourceSelector', () => {
    const hostName = 'testhub.azure-devices.net';
    const state = {
        activeAzureResource: {
            accessVerificationState: null,
            hostName
        }
    }

    it('returns active azure resource', () => {
        expect(getActiveAzureResourceSelector(state)).toEqual({
            accessVerificationState: null,
            hostName
        });
    });

    it('returns active azure resource', () => {
        expect(getActiveAzureResourceHostNameSelector(state)).toEqual(hostName);
    });

    it('returns active azure connection string', () => {
        expect(getActiveAzureResourceConnectionStringSelector(state)).toEqual('');
    });

});
