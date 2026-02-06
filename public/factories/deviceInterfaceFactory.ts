/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ipcRenderer } from 'electron';
import { MESSAGE_CHANNELS } from '../constants';
import {
    DeviceInterface,
    DataPlaneRequest,
    DataPlaneResponse,
    ReadFileRequest,
    GetDirectoriesRequest,
    StartEventHubMonitoringRequest,
    Message,
    SendMessageToDeviceParameters
} from '../interfaces/deviceInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateDeviceInterface = (): DeviceInterface => {
    return {
        dataPlaneRequest: async (request: DataPlaneRequest): Promise<DataPlaneResponse> => {
            return invokeInMainWorld<DataPlaneResponse>(MESSAGE_CHANNELS.DATA_PLANE_REQUEST, request);
        },

        readLocalFile: async (request: ReadFileRequest): Promise<string | null> => {
            return invokeInMainWorld<string | null>(MESSAGE_CHANNELS.READ_LOCAL_FILE, request);
        },

        readLocalFileNaive: async (request: ReadFileRequest): Promise<string> => {
            return invokeInMainWorld<string>(MESSAGE_CHANNELS.READ_LOCAL_FILE_NAIVE, request);
        },

        getDirectories: async (request: GetDirectoriesRequest): Promise<string[]> => {
            return invokeInMainWorld<string[]>(MESSAGE_CHANNELS.GET_DIRECTORIES, request);
        },

        startEventHubMonitoring: async (request: StartEventHubMonitoringRequest): Promise<void> => {
            return invokeInMainWorld<void>(MESSAGE_CHANNELS.EVENTHUB_START_MONITORING, request);
        },

        stopEventHubMonitoring: async (): Promise<void> => {
            return invokeInMainWorld<void>(MESSAGE_CHANNELS.EVENTHUB_STOP_MONITORING);
        },

        onEventHubMessage: (callback: (messages: Message[]) => void): (() => void) => {
            const handler = (_event: Electron.IpcRendererEvent, messages: Message[]) => {
                callback(messages);
            };
            ipcRenderer.on(MESSAGE_CHANNELS.EVENTHUB_MESSAGE_RECEIVED, handler);

            // Return unsubscribe function
            return () => {
                ipcRenderer.removeListener(MESSAGE_CHANNELS.EVENTHUB_MESSAGE_RECEIVED, handler);
            };
        },

        sendMessageToDevice: async (_params: SendMessageToDeviceParameters): Promise<void> => {
            // This is now handled via dataPlaneRequest - kept for backward compatibility
            throw new Error('Use dataPlaneRequest instead');
        }
    };
};
