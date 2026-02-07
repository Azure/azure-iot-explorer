/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Message, StartEventHubMonitoringRequest } from '../../../../public/interfaces/deviceInterface';
import { getDeviceInterface } from '../shared/interfaceUtils';

// Re-export types for backward compatibility
export type { Message, StartEventHubMonitoringRequest as StartEventHubMonitoringParameters };

/**
 * Start EventHub monitoring via IPC
 */
export const startEventHubMonitoring = async (params: StartEventHubMonitoringRequest): Promise<void> => {
    const deviceApi = getDeviceInterface();
    await deviceApi.startEventHubMonitoring(params);
};

/**
 * Stop EventHub monitoring via IPC
 */
export const stopEventHubMonitoring = async (): Promise<void> => {
    const deviceApi = getDeviceInterface();
    await deviceApi.stopEventHubMonitoring();
};

/**
 * Subscribe to EventHub messages via IPC
 * Returns an unsubscribe function
 */
export const subscribeToEventHubMessages = (callback: (messages: Message[]) => void): (() => void) => {
    const deviceApi = getDeviceInterface();
    return deviceApi.onEventHubMessage(callback);
};
