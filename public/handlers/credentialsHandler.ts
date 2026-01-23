/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { safeStorage } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

let credentialsFilePath: string | null = null;

/**
 * Initialize the credentials storage with the app's user data path
 */
export const initializeCredentialsStorage = (userDataPath: string): void => {
    credentialsFilePath = path.join(userDataPath, 'credentials.enc');
};

/**
 * Check if encryption is available on this system
 */
export const isEncryptionAvailable = (): boolean => {
    return safeStorage.isEncryptionAvailable();
};

/**
 * Store an encrypted credential
 */
export const storeCredential = (key: string, value: string): boolean => {
    if (!credentialsFilePath) {
        throw new Error('Credentials storage not initialized');
    }

    if (!safeStorage.isEncryptionAvailable()) {
        return false;
    }

    try {
        // Read existing credentials or create new object
        let credentials: Record<string, string> = {};
        if (fs.existsSync(credentialsFilePath)) {
            const encrypted = fs.readFileSync(credentialsFilePath);
            const decrypted = safeStorage.decryptString(encrypted);
            credentials = JSON.parse(decrypted);
        }

        // Add/update credential
        credentials[key] = value;

        // Encrypt and save
        const encrypted = safeStorage.encryptString(JSON.stringify(credentials));
        fs.writeFileSync(credentialsFilePath, encrypted);

        return true;
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error('Failed to store credential:', error);
        return false;
    }
};

/**
 * Retrieve an encrypted credential
 */
export const getCredential = (key: string): string | null => {
    if (!credentialsFilePath) {
        throw new Error('Credentials storage not initialized');
    }

    if (!safeStorage.isEncryptionAvailable()) {
        return null;
    }

    try {
        if (!fs.existsSync(credentialsFilePath)) {
            return null;
        }

        const encrypted = fs.readFileSync(credentialsFilePath);
        const decrypted = safeStorage.decryptString(encrypted);
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
 */
export const deleteCredential = (key: string): boolean => {
    if (!credentialsFilePath) {
        throw new Error('Credentials storage not initialized');
    }

    try {
        if (!fs.existsSync(credentialsFilePath)) {
            return true;
        }

        if (!safeStorage.isEncryptionAvailable()) {
            return false;
        }

        const encrypted = fs.readFileSync(credentialsFilePath);
        const decrypted = safeStorage.decryptString(encrypted);
        const credentials = JSON.parse(decrypted);

        delete credentials[key];

        const newEncrypted = safeStorage.encryptString(JSON.stringify(credentials));
        fs.writeFileSync(credentialsFilePath, newEncrypted);

        return true;
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error('Failed to delete credential:', error);
        return false;
    }
};

/**
 * List all credential keys (not values)
 */
export const listCredentials = (): string[] => {
    if (!credentialsFilePath) {
        throw new Error('Credentials storage not initialized');
    }

    try {
        if (!fs.existsSync(credentialsFilePath)) {
            return [];
        }

        if (!safeStorage.isEncryptionAvailable()) {
            return [];
        }

        const encrypted = fs.readFileSync(credentialsFilePath);
        const decrypted = safeStorage.decryptString(encrypted);
        const credentials = JSON.parse(decrypted);

        return Object.keys(credentials);
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error('Failed to list credentials:', error);
        return [];
    }
};
