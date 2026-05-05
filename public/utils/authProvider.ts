/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    PublicClientApplication,
    Configuration,
    LogLevel,
    AccountInfo,
    AuthorizationCodeRequest,
    AuthorizationUrlRequest,
    AuthenticationResult,
    SilentFlowRequest } from '@azure/msal-node';
import { BrowserWindow } from 'electron';

const MSAL_CONFIG: Configuration = {
    auth: {
        clientId: '67ccd9d7-f5c7-475c-9da0-9700c24b2e66',
        authority: 'https://login.microsoftonline.com/common',
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose,
        }
    }
};

export class AuthProvider {
    private clientApplication: PublicClientApplication;
    private account: AccountInfo;
    private authCodeUrlParams: AuthorizationUrlRequest;
    private authCodeRequest: AuthorizationCodeRequest;
    private silentProfileRequest: SilentFlowRequest;

    constructor() {
        this.clientApplication = new PublicClientApplication(MSAL_CONFIG);
        this.account = null;
        this.setRequestObjects();
    }

    public get currentAccount(): AccountInfo | null {
        return this.account;
    }

    /**
     * Initialize request objects used by this AuthModule.
     */
    private setRequestObjects(): void {
        const requestScopes =  ['openid', 'profile', 'https://management.azure.com/user_impersonation'];
        const redirectUri = 'https://login.microsoftonline.com/oauth2/nativeclient';

        const baseSilentRequest: { account: any; forceRefresh: boolean } = {
            account: null,
            forceRefresh: false
        };

        this.authCodeUrlParams = {
            scopes: requestScopes,
            redirectUri: redirectUri
        };

        this.authCodeRequest = {
            scopes: requestScopes,
            redirectUri: redirectUri,
            code: null
        }

        this.silentProfileRequest = {
            ...baseSilentRequest,
            scopes: [],
        };
    }

    async getProfileTokenIfPresent(): Promise<string> {
        let authResponse: AuthenticationResult;
        const account = this.account || await this.getAccount();

        if (account) {
            this.silentProfileRequest.account = account;
            try {
                authResponse = await this.clientApplication.acquireTokenSilent(this.silentProfileRequest);
            } catch (error) {
                // do nothing
            }
        }

        return authResponse?.accessToken || null;
    }

    async getTokenForTenant(authWindow: BrowserWindow, tenantId: string): Promise<string> {
        const account = this.account || await this.getAccount();
        if (!account) {
            return null;
        }

        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!guidRegex.test(tenantId)) {
            console.error('Invalid tenant ID format');
            return null;
        }

        const tenantAuthority = `https://login.microsoftonline.com/${tenantId}`;
        const tenantRequest: SilentFlowRequest = {
            account,
            scopes: ['https://management.azure.com/user_impersonation'],
            authority: tenantAuthority,
            forceRefresh: false
        };

        try {
            const authResponse = await this.clientApplication.acquireTokenSilent(tenantRequest);
            return authResponse?.accessToken || null;
        } catch (error) {
            // If silent acquisition fails, try interactive
            try {
                const authResponse = await this.getTokenInteractive(authWindow, {
                    ...this.authCodeUrlParams,
                    scopes: ['https://management.azure.com/user_impersonation'],
                    authority: tenantAuthority
                });
                return authResponse?.accessToken || null;
            } catch (interactiveError) {
                console.log('Failed to acquire tenant-scoped token:', interactiveError);
                return null;
            }
        }
    }

    async getToken(authWindow: BrowserWindow, request: SilentFlowRequest): Promise<string> {
        let authResponse: AuthenticationResult;
        const account = this.account || await this.getAccount();
        if (account) {
            request.account = account;
            authResponse = await this.getTokenSilent(authWindow, request);
        } else {
            authResponse = await this.getTokenInteractive(authWindow, this.authCodeRequest);
        }

        return authResponse.accessToken || null;
    }

    async getTokenSilent(authWindow: BrowserWindow, tokenRequest: SilentFlowRequest): Promise<AuthenticationResult> {
        try {
            return await this.clientApplication.acquireTokenSilent(tokenRequest);
        } catch (error) {
            console.log('Silent token acquisition failed, acquiring token using redirect');
            return await this.getTokenInteractive(authWindow, this.authCodeRequest);
        }
    }

    async getTokenInteractive(authWindow: BrowserWindow, tokenRequest: AuthorizationUrlRequest ): Promise<AuthenticationResult> {
        const authCodeUrlParams = { ...this.authCodeUrlParams, scopes: tokenRequest.scopes, ...(tokenRequest.authority && { authority: tokenRequest.authority }) };
        const authCodeUrl = await this.clientApplication.getAuthCodeUrl(authCodeUrlParams);

        // Use a separate popup for auth so the main window is never affected
        const authPopup = new BrowserWindow({
            width: 600,
            height: 800,
            parent: authWindow,
            modal: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false
            }
        });

        try {
            const authCode = await this.listenForAuthCode(authCodeUrl, authPopup);
            const authResult = await this.clientApplication.acquireTokenByCode({
                ...this.authCodeRequest,
                scopes: tokenRequest.scopes,
                code: authCode,
                ...(tokenRequest.authority && { authority: tokenRequest.authority })
            });
            return authResult;
        } finally {
            if (!authPopup.isDestroyed()) {
                authPopup.close();
            }
        }
    }

    async login(authWindow: BrowserWindow): Promise<void> {
        const authResult = await this.getTokenInteractive(authWindow, this.authCodeUrlParams);
        return this.handleResponse(authResult);
    }

    async loginSilent(): Promise<AccountInfo> {
        if (!this.account) {
            this.account = await this.getAccount();
        }

        return this.account;
    }

    async logout(): Promise<void> {
        if (this.account) {
            await this.clientApplication.getTokenCache().removeAccount(this.account);
            this.account = null;
        }
    }

    async logoutWithSessionClear(mainWindow: BrowserWindow): Promise<void> {
        // Clear MSAL token cache
        if (this.account) {
            await this.clientApplication.getTokenCache().removeAccount(this.account);
            this.account = null;
        }

        // Clear browser session cookies to fully sign out of Microsoft SSO
        // Clear Microsoft SSO cookies so the user can log in as a different account
        await mainWindow.webContents.session.clearStorageData({
            storages: ['cookies']
        });
    }

    private async listenForAuthCode(navigateUrl: string, authWindow: BrowserWindow): Promise<string> {
        authWindow.loadURL(navigateUrl);
        return new Promise((resolve, reject) => {
            let settled = false;

            const onRedirect = (event: Electron.Event, responseUrl: string) => {
                try {
                    const parsedUrl = new URL(responseUrl);
                    const authCode = parsedUrl.searchParams.get('code');
                    if (authCode) {
                        event.preventDefault();
                        settled = true;
                        cleanup();
                        resolve(authCode);
                    }
                    const error = parsedUrl.searchParams.get('error');
                    if (error) {
                        event.preventDefault();
                        settled = true;
                        cleanup();
                        reject(new Error(`${error}: ${parsedUrl.searchParams.get('error_description') || 'Authentication failed'}`));
                    }
                } catch (err) {
                    settled = true;
                    cleanup();
                    reject(err);
                }
            };

            const onClose = () => {
                if (!settled) {
                    settled = true;
                    cleanup();
                    reject(new Error('Authentication cancelled by user'));
                }
            };

            const cleanup = () => {
                if (!authWindow.isDestroyed()) {
                    authWindow.webContents.removeListener('will-redirect', onRedirect);
                    authWindow.removeListener('closed', onClose);
                }
            };

            authWindow.webContents.on('will-redirect', onRedirect);
            authWindow.on('closed', onClose);
        });
    }

    /**
     * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
     * @param response
    */
    private async handleResponse(response: AuthenticationResult) {
        if (response !== null) {
            this.account = response.account;
        } else {
            this.account = await this.getAccount();
        }
    }

    /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * TODO: Add account chooser code
     *
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
    */
    private async getAccount(): Promise<AccountInfo> {
        // need to call getAccount here?
        const cache = this.clientApplication.getTokenCache();
        const currentAccounts = await cache.getAllAccounts();

        if (currentAccounts === null) {
            console.log('No accounts detected');
            return null;
        }

        if (currentAccounts.length > 1) {
            // Add choose account code here
            console.log('Multiple accounts detected, need to add choose account code.');
            return currentAccounts[0];
        } else if (currentAccounts.length === 1) {
            return currentAccounts[0];
        } else {
            return null;
        }
    }
}