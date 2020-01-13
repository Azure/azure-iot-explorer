import * as Msal from 'msal';

let authResponse: Msal.AuthResponse | undefined;
let authError: Msal.AuthError | undefined;

const config: Msal.Configuration = {
    auth: {
        authority: 'https://login.microsoftonline.com/common',
        clientId: 'c9d0ec1d-3630-477b-ae58-83585222d684',
        redirectUri: window.location.origin
    },
    cache: {
        storeAuthStateInCookie: true
    }
};

const authenticationParameters: Msal.AuthenticationParameters = {
    scopes: [
        'openid',
        'profile',
        'User.read'
    ]
};

const azureResourceManagementParameters: Msal.AuthenticationParameters = {
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
        if (error.errorMessage && error.errorMessage.indexOf('interaction_required') !== -1) {
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
