/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Message, StartEventHubMonitoringRequest } from '../../../../public/interfaces/deviceInterface';

// Re-export types for backward compatibility
export type { Message, StartEventHubMonitoringRequest as StartEventHubMonitoringParameters };

/**
 * Start EventHub monitoring via IPC
 */
export const startEventHubMonitoring = async (params: StartEventHubMonitoringRequest): Promise<void> => {
    if (!window.api_device) {
        throw new Error('Device API not available - not running in Electron');
    }

    await window.api_device.startEventHubMonitoring(params);
};

/**
 * Stop EventHub monitoring via IPC
 */
export const stopEventHubMonitoring = async (): Promise<void> => {
    if (!window.api_device) {
        throw new Error('Device API not available - not running in Electron');
    }

    await window.api_device.stopEventHubMonitoring();
};

/**
 * Subscribe to EventHub messages via IPC
 * Returns an unsubscribe function
 */
export const subscribeToEventHubMessages = (callback: (messages: Message[]) => void): (() => void) => {
    if (!window.api_device) {
        throw new Error('Device API not available - not running in Electron');
    }

    return window.api_device.onEventHubMessage(callback);
};
