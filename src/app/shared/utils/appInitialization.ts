/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { CUSTOM_CONTROLLER_PORT } from '../../constants/browserStorage';

/**
 * Initializes app settings by fetching configuration from the main process via IPC.
 * This replaces the previous approach of using executeJavaScript to set localStorage values,
 * which was a security risk.
 */
export const initializeAppSettings = async (): Promise<void> => {
    if (appConfig.hostMode === HostMode.Electron && window.api_settings?.getCustomPort) {
        try {
            const customPort = await window.api_settings.getCustomPort();
            if (customPort !== null) {
                localStorage.setItem(CUSTOM_CONTROLLER_PORT, customPort.toString());
            } else {
                localStorage.removeItem(CUSTOM_CONTROLLER_PORT);
            }
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.warn('Failed to get custom port from main process:', error);
            localStorage.removeItem(CUSTOM_CONTROLLER_PORT);
        }
    }
};
