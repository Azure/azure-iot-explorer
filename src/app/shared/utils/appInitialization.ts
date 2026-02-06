/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

/**
 * Initializes app settings.
 * Previously fetched custom port from main process, but this is no longer needed
 * since we use IPC directly instead of HTTP server.
 */
export const initializeAppSettings = async (): Promise<void> => {
    // No longer need to fetch custom port since we don't use HTTP server
    // This function is kept for backward compatibility but does nothing
    return Promise.resolve();
};
