/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    executeLoginRedirect,
    msalInstance,
    executeAzureResourceManagementTokenRequest,
    azureResourceManagementParameters,
    executeLogout,
    executeLoginRedirectCallback,
    getLoginRedirectError,
    getLoginRedirectResponse
} from './authService';

describe('executeLoginRedirect', () => {
    it('calls msalInstance.loginRedirect', () => {
        const spy = jest.spyOn(msalInstance, 'loginRedirect');
        executeLoginRedirect();

        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('executeAzureResourceManagementTokenRequest', () => {
    it('calls msalInstance.acquireTokenSilent', async () => {
        const spy = jest.spyOn(msalInstance, 'acquireTokenSilent');
        spy.mockResolvedValue({
            accessToken: 'accessToken1'
        } as any); // tslint:disable-line:no-any

        const result = await executeAzureResourceManagementTokenRequest();
        expect(spy).toHaveBeenCalledWith(azureResourceManagementParameters);
        expect(result).toEqual('accessToken1');
    });

    it('does not call msalInstance.acquireTokenRedirect when general exception thrown', async () => {
        const spy = jest.spyOn(msalInstance, 'acquireTokenSilent');
        spy.mockImplementation(() => {
            throw new Error('consent_required');
        });

        const spyRedirect = jest.spyOn(msalInstance, 'acquireTokenRedirect');
        await executeAzureResourceManagementTokenRequest();
        expect(spyRedirect).toHaveBeenCalledTimes(0);
    });

    it('calls msalInstance.acquireTokenRedirect when exception thrown of interaction_required', async () => {
        const spy = jest.spyOn(msalInstance, 'acquireTokenSilent');
        spy.mockImplementation(() => {
            throw new Error('interaction_required');
        });

        const spyRedirect = jest.spyOn(msalInstance, 'acquireTokenRedirect');
        await executeAzureResourceManagementTokenRequest();
        expect(spyRedirect).toHaveBeenCalledTimes(1);
        expect(spyRedirect).toHaveBeenCalledWith(azureResourceManagementParameters);
    });
});

describe('executeLogout', () => {
    it('calls msalInstance.logout', () => {
        const spy = jest.spyOn(msalInstance, 'logout');
        executeLogout();

        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('executeLoginRedirectCallback', () => {
    it('sets authResponse and authError', () => {
        executeLoginRedirectCallback(
            { error: 'error1'} as any, // tslint:disable-line:no-any
            { response: 'response1'} as any, // tslint:disable-line:no-any
        );

        expect(getLoginRedirectResponse()).toEqual({ response: 'response1'});
        expect(getLoginRedirectError()).toEqual({ error: 'error1'});
    });
});
