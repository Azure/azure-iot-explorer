/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import {
    getActiveAzureResourceSelector,
    getActiveAzureResourceHostNameSelector,
    getActiveAzureResourceConnectionStringSelector
} from './selectors';
import { getInitialState } from '../api/shared/testHelper';

describe('getAzureResourceSelector', () => {
    const state = getInitialState();
    const hostName = 'testhub.azure-devices.net';
    state.azureResourceState = Record({
        activeAzureResource: {
            accessVerificationState: null,
            hostName
        }
    })();

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
