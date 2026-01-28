/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { safeStorage } from 'electron';

/**
 * Check if encryption is available on this system
 */
export const isEncryptionAvailable = (): boolean => {
    return safeStorage.isEncryptionAvailable();
};

/**
 * Store an encrypted credential
 * @param key - The credential key
 * @param value - The credential value to store
 * @param currentEncryptedData - The current encrypted data from localStorage (base64), or null
 * @returns The new encrypted data (base64) to store in localStorage, or null on failure
 */
export const storeCredential = (key: string, value: string, currentEncryptedData: string | null): string | null => {
    if (!safeStorage.isEncryptionAvailable()) {
        return null;
    }

    try {
        // Decrypt existing credentials or create new object
        let credentials: Record<string, string> = {};
        if (currentEncryptedData) {
            const encryptedBuffer = Buffer.from(currentEncryptedData, 'base64');
            const decrypted = safeStorage.decryptString(encryptedBuffer);
            credentials = JSON.parse(decrypted);
        }

        // Add/update credential
        credentials[key] = value;

        // Encrypt and return as base64
        const encrypted = safeStorage.encryptString(JSON.stringify(credentials));
        return encrypted.toString('base64');
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error('Failed to store credential:', error);
        return null;
    }
};

/**
 * Retrieve an encrypted credential
 * @param key - The credential key to retrieve
 * @param encryptedData - The encrypted data from localStorage (base64)
 * @returns The decrypted credential value, or null if not found
 */
export const getCredential = (key: string, encryptedData: string | null): string | null => {
    if (!encryptedData || !safeStorage.isEncryptionAvailable()) {
        return null;
    }

    try {
        const encryptedBuffer = Buffer.from(encryptedData, 'base64');
        const decrypted = safeStorage.decryptString(encryptedBuffer);
        const credentials = JSON.parse(decrypted);

        return credentials[key] || null;
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error('Failed to retrieve credential:', error);
        return null;
    }
};

/**
 * Delete a credential
 * @param key - The credential key to delete
 * @param currentEncryptedData - The current encrypted data from localStorage (base64), or null
 * @returns The new encrypted data (base64) to store in localStorage, or null on failure
 */
export const deleteCredential = (key: string, currentEncryptedData: string | null): string | null => {
    if (!currentEncryptedData) {
        return null; // Nothing to delete
    }

    if (!safeStorage.isEncryptionAvailable()) {
        return null;
    }

    try {
        const encryptedBuffer = Buffer.from(currentEncryptedData, 'base64');
        const decrypted = safeStorage.decryptString(encryptedBuffer);
        const credentials = JSON.parse(decrypted);

        delete credentials[key];

        // Return encrypted data or null if empty
        if (Object.keys(credentials).length === 0) {
            return null; // Signal to remove from localStorage
        }

        const newEncrypted = safeStorage.encryptString(JSON.stringify(credentials));
        return newEncrypted.toString('base64');
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error('Failed to delete credential:', error);
        return null;
    }
};

/**
 * List all credential keys (not values)
 * @param encryptedData - The encrypted data from localStorage (base64)
 * @returns Array of credential keys
 */
export const listCredentials = (encryptedData: string | null): string[] => {
    if (!encryptedData || !safeStorage.isEncryptionAvailable()) {
        return [];
    }

    try {
        const encryptedBuffer = Buffer.from(encryptedData, 'base64');
        const decrypted = safeStorage.decryptString(encryptedBuffer);
        const credentials = JSON.parse(decrypted);

        return Object.keys(credentials);
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error('Failed to list credentials:', error);
        return [];
    }
};
