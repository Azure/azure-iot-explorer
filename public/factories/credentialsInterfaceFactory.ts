/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { CredentialsInterface } from '../interfaces/credentialsInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

const ENCRYPTED_CREDENTIALS_KEY = 'encrypted_credentials';

export const generateCredentialsInterface = (): CredentialsInterface => {
    return {
        delete: async (key: string): Promise<boolean> => {
            const encryptedData = localStorage.getItem(ENCRYPTED_CREDENTIALS_KEY);
            const newEncryptedData = await invokeInMainWorld<string | null>(
                MESSAGE_CHANNELS.CREDENTIAL_DELETE, 
                key, 
                encryptedData
            );
            
            if (newEncryptedData) {
                localStorage.setItem(ENCRYPTED_CREDENTIALS_KEY, newEncryptedData);
            } else {
                localStorage.removeItem(ENCRYPTED_CREDENTIALS_KEY);
            }
            return true;
        },
        get: async (key: string): Promise<string | null> => {
            const encryptedData = localStorage.getItem(ENCRYPTED_CREDENTIALS_KEY);
            const result = await invokeInMainWorld<string | null>(
                MESSAGE_CHANNELS.CREDENTIAL_GET, 
                key, 
                encryptedData
            );
            return result;
        },
        isEncryptionAvailable: async (): Promise<boolean> => {
            const result = invokeInMainWorld<boolean>(MESSAGE_CHANNELS.CREDENTIAL_IS_ENCRYPTION_AVAILABLE);
            return result;
        },
        list: async (): Promise<string[]> => {
            const encryptedData = localStorage.getItem(ENCRYPTED_CREDENTIALS_KEY);
            const result = await invokeInMainWorld<string[]>(
                MESSAGE_CHANNELS.CREDENTIAL_LIST, 
                encryptedData
            );
            return result;
        },
        store: async (key: string, value: string): Promise<boolean> => {
            const encryptedData = localStorage.getItem(ENCRYPTED_CREDENTIALS_KEY);
            const newEncryptedData = await invokeInMainWorld<string | null>(
                MESSAGE_CHANNELS.CREDENTIAL_STORE, 
                key, 
                value, 
                encryptedData
            );
            
            if (newEncryptedData) {
                localStorage.setItem(ENCRYPTED_CREDENTIALS_KEY, newEncryptedData);
                return true;
            }
            return false;
        }
    };
};
