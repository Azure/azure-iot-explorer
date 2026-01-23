/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { CredentialsInterface } from '../interfaces/credentialsInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateCredentialsInterface = (): CredentialsInterface => {
    return {
        delete: async (key: string): Promise<boolean> => {
            const result = invokeInMainWorld<boolean>(MESSAGE_CHANNELS.CREDENTIAL_DELETE, key);
            return result;
        },
        get: async (key: string): Promise<string | null> => {
            const result = invokeInMainWorld<string | null>(MESSAGE_CHANNELS.CREDENTIAL_GET, key);
            return result;
        },
        isEncryptionAvailable: async (): Promise<boolean> => {
            const result = invokeInMainWorld<boolean>(MESSAGE_CHANNELS.CREDENTIAL_IS_ENCRYPTION_AVAILABLE);
            return result;
        },
        list: async (): Promise<string[]> => {
            const result = invokeInMainWorld<string[]>(MESSAGE_CHANNELS.CREDENTIAL_LIST);
            return result;
        },
        store: async (key: string, value: string): Promise<boolean> => {
            const result = invokeInMainWorld<boolean>(MESSAGE_CHANNELS.CREDENTIAL_STORE, key, value);
            return result;
        }
    };
};
