/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface AuthenticationInterface {
    login(): Promise<void>;
    logout(): Promise<void>;
    getProfileToken(): Promise<string>;
}
