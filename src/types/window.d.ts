/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SettingsInterface } from '../../public/interfaces/settingsInterface';
import { AuthenticationInterface } from '../../public/interfaces/authenticationInterface';
import { CredentialsInterface } from '../../public/interfaces/credentialsInterface';

declare global {
    interface Window {
        api_settings?: SettingsInterface;
        api_authentication?: AuthenticationInterface;
        api_credentials?: CredentialsInterface;
    }
}

export {};
