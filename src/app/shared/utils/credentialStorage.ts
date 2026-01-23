/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { ConnectionStringWithExpiry } from '../../connectionStrings/state';

const CONN_STRINGS_KEY = 'connection-strings';

/**
 * Store connection strings using encrypted storage in Electron mode,
 * with fallback to localStorage for browser mode.
 */
export const storeConnectionStrings = async (value: ConnectionStringWithExpiry[]): Promise<void> => {
    const serialized = JSON.stringify(value);

    if (appConfig.hostMode === HostMode.Electron && window.api_credentials) {
        try {
            const isAvailable = await window.api_credentials.isEncryptionAvailable();
            if (isAvailable) {
                await window.api_credentials.store(CONN_STRINGS_KEY, serialized);
                // Remove from localStorage if migrating
                localStorage.removeItem(CONNECTION_STRING_NAME_LIST);
                return;
            }
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.warn('Failed to use encrypted storage, falling back to localStorage:', error);
        }
    }

    // Fallback to localStorage for browser mode or if encryption unavailable
    localStorage.setItem(CONNECTION_STRING_NAME_LIST, serialized);
};

/**
 * Retrieve connection strings from encrypted storage in Electron mode,
 * with automatic migration from localStorage if needed.
 */
export const getConnectionStrings = async (): Promise<ConnectionStringWithExpiry[]> => {
    if (appConfig.hostMode === HostMode.Electron && window.api_credentials) {
        try {
            const isAvailable = await window.api_credentials.isEncryptionAvailable();
            if (isAvailable) {
                const encrypted = await window.api_credentials.get(CONN_STRINGS_KEY);
                if (encrypted) {
                    return JSON.parse(encrypted);
                }

                // Migration: check localStorage for existing data
                const legacy = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
                if (legacy) {
                    const parsed = JSON.parse(legacy) as ConnectionStringWithExpiry[];
                    // Migrate to encrypted storage
                    await window.api_credentials.store(CONN_STRINGS_KEY, legacy);
                    localStorage.removeItem(CONNECTION_STRING_NAME_LIST);
                    return parsed;
                }

                return [];
            }
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.warn('Failed to use encrypted storage, falling back to localStorage:', error);
        }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    return stored ? JSON.parse(stored) : [];
};

/**
 * Delete all connection strings from storage
 */
export const deleteConnectionStrings = async (): Promise<void> => {
    if (appConfig.hostMode === HostMode.Electron && window.api_credentials) {
        try {
            await window.api_credentials.delete(CONN_STRINGS_KEY);
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.warn('Failed to delete from encrypted storage:', error);
        }
    }
    localStorage.removeItem(CONNECTION_STRING_NAME_LIST);
};
