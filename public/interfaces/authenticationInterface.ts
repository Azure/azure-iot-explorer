/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface AuthenticationResult {
    authority: string;
    uniqueId: string;
    tenantId: string;
    scopes: Array<string>;
    account: AccountInfo | null;
    idToken: string;
    idTokenClaims: object;
    accessToken: string;
    fromCache: boolean;
    expiresOn: Date | null;
    tokenType: string;
    extExpiresOn?: Date;
    state?: string;
    familyId?: string;
    cloudGraphHostName?: string;
    msGraphHost?: string;
};

export interface AccountInfo {
    homeAccountId: string;
    environment: string;
    tenantId: string;
    username: string;
    localAccountId: string;
    name?: string;
    idTokenClaims?: object;
};

export interface AuthenticationInterface {
    login(): Promise<AuthenticationResult>;
    logout(): Promise<void>;
}
