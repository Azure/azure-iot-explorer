/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SettingsInterface } from '../../public/interfaces/settingsInterface';
import { AuthenticationInterface } from '../../public/interfaces/authenticationInterface';

declare global {
    interface Window {
        api_settings?: SettingsInterface;
        api_authentication?: AuthenticationInterface;
    }
}

export {};
