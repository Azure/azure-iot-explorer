/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface SettingsInterface {
    getApiAuthToken(): Promise<string | null>;
    getApiCertificate(): Promise<string | null>;
    getApiCertFingerprint(): Promise<string | null>;
    getCustomPort(): Promise<number | null>;
    useHighContrast(): Promise<boolean>;
}
