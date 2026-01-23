/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../../appConfig/appConfig';

let authToken: string | null = null;
let isInitialized = false;

/**
 * Initialize secure fetch by retrieving auth token from main process via IPC
 */
export const initializeSecureFetch = async (): Promise<void> => {
    if (isInitialized) {
        return;
    }

    // Only initialize in Electron mode
    if (appConfig.hostMode === HostMode.Electron && window.api_settings?.getApiAuthToken) {
        try {
            authToken = await window.api_settings.getApiAuthToken();
            isInitialized = true;
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.error('Failed to initialize secure fetch:', error);
            throw new Error('Failed to initialize secure API communication');
        }
    } else {
        // Browser mode - no auth token needed for local dev server
        isInitialized = true;
    }
};

/**
 * Secure fetch wrapper that includes authentication token header
 */
export const secureFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    // Ensure initialized
    if (!isInitialized) {
        await initializeSecureFetch();
    }

    // Build headers with auth token
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {})
    };

    if (authToken) {
        headers['x-auth-token'] = authToken;
    }

    // Make request
    const response = await fetch(url, {
        ...options,
        headers
    });

    // Handle auth errors
    if (response.status === 401) {
        // tslint:disable-next-line: no-console
        console.error('API authentication failed - token may be invalid');
        // Reset initialization to allow retry
        isInitialized = false;
        authToken = null;
    }

    return response;
};

/**
 * Get WebSocket URL with authentication token in query string
 */
export const getSecureWebSocketUrl = (baseUrl: string): string => {
    if (authToken) {
        const url = new URL(baseUrl);
        url.searchParams.set('token', authToken);
        return url.toString();
    }
    return baseUrl;
};

/**
 * Reset the secure fetch state (useful for testing or re-authentication)
 */
export const resetSecureFetch = (): void => {
    isInitialized = false;
    authToken = null;
};
