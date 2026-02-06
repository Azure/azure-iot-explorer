/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface CredentialsInterface {
    delete(key: string): Promise<boolean>;
    get(key: string): Promise<string | null>;
    isEncryptionAvailable(): Promise<boolean>;
    list(): Promise<string[]>;
    store(key: string, value: string): Promise<boolean>;
}
