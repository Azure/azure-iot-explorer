/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { ConnectionStringWithExpiry } from '../../connectionStrings/state';
import { getCredentialsInterface } from '../../api/shared/interfaceUtils';

const CONN_STRINGS_KEY = 'connection-strings';

/**
 * Store connection strings using encrypted storage.
 * Falls back to localStorage if encryption is unavailable.
 */
export const storeConnectionStrings = async (value: ConnectionStringWithExpiry[]): Promise<void> => {
    const serialized = JSON.stringify(value);
    const credentialsApi = getCredentialsInterface();

    try {
        const isAvailable = await credentialsApi.isEncryptionAvailable();
        if (isAvailable) {
            await credentialsApi.store(CONN_STRINGS_KEY, serialized);
            // Remove from localStorage if migrating
            localStorage.removeItem(CONNECTION_STRING_NAME_LIST);
            return;
        }
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.warn('Failed to use encrypted storage, falling back to localStorage:', error);
    }

    // Fallback to localStorage if encryption unavailable
    localStorage.setItem(CONNECTION_STRING_NAME_LIST, serialized);
};

/**
 * Retrieve connection strings from encrypted storage,
 * with automatic migration from localStorage if needed.
 */
export const getConnectionStrings = async (): Promise<ConnectionStringWithExpiry[]> => {
    const credentialsApi = getCredentialsInterface();

    try {
        const isAvailable = await credentialsApi.isEncryptionAvailable();
        if (isAvailable) {
            const encrypted = await credentialsApi.get(CONN_STRINGS_KEY);
            if (encrypted) {
                return JSON.parse(encrypted);
            }

            // Migration: check localStorage for existing data
            const legacy = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
            if (legacy) {
                const parsed = JSON.parse(legacy) as ConnectionStringWithExpiry[];
                // Migrate to encrypted storage
                await credentialsApi.store(CONN_STRINGS_KEY, legacy);
                localStorage.removeItem(CONNECTION_STRING_NAME_LIST);
                return parsed;
            }

            return [];
        }
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.warn('Failed to use encrypted storage, falling back to localStorage:', error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    return stored ? JSON.parse(stored) : [];
};

/**
 * Delete all connection strings from storage
 */
export const deleteConnectionStrings = async (): Promise<void> => {
    const credentialsApi = getCredentialsInterface();

    try {
        await credentialsApi.delete(CONN_STRINGS_KEY);
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.warn('Failed to delete from encrypted storage:', error);
    }
    localStorage.removeItem(CONNECTION_STRING_NAME_LIST);
};
