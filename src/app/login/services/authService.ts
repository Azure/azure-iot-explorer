/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as Msal from 'msal';
import { appConfig } from '../../../appConfig/appConfig';

let authResponse: Msal.AuthResponse | undefined;
let authError: Msal.AuthError | undefined;

const config: Msal.Configuration = {
    auth: {
        authority: appConfig && appConfig.authServiceSettings && appConfig.authServiceSettings.authority,
        clientId: appConfig && appConfig.authServiceSettings && appConfig.authServiceSettings.client,
        redirectUri: window.location.origin
    },
    cache: {
        storeAuthStateInCookie: true
    }
};

export const authenticationParameters: Msal.AuthenticationParameters = {
    scopes: [
        'openid',
        'profile',
        'User.read'
    ]
};

export const azureResourceManagementParameters: Msal.AuthenticationParameters = {
    scopes: [
        'https://management.azure.com//user_impersonation',
    ]
};

export const executeLoginRedirect = () => {
      msalInstance.loginRedirect(authenticationParameters);
};

export const executeAzureResourceManagementTokenRequest = async (): Promise<string | undefined> => {
    try {
        const response = await msalInstance.acquireTokenSilent(azureResourceManagementParameters);
        return response.accessToken;
    } catch (error) {
        if (error.message && error.message.indexOf('interaction_required') !== -1) {
            msalInstance.acquireTokenRedirect(azureResourceManagementParameters);
        }
    }
};

export const executeLogout = () => {
    msalInstance.logout();
};

export const getLoginRedirectResponse = (): Msal.AuthResponse | undefined => {
    return authResponse;
};

export const getLoginRedirectError = (): Msal.AuthError | undefined => {
    return authError;
};

export const executeLoginRedirectCallback = (error: Msal.AuthError, response: Msal.AuthResponse) => {
    authResponse = response;
    authError = error;
};

export const msalInstance = new Msal.UserAgentApplication(config);
msalInstance.handleRedirectCallback(executeLoginRedirectCallback);
