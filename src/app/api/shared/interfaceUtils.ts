/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SettingsInterface } from '../../../../public/interfaces/settingsInterface';
import { AuthenticationInterface } from './../../../../public/interfaces/authenticationInterface';
import { CredentialsInterface } from '../../../../public/interfaces/credentialsInterface';
import { DeviceInterface } from '../../../../public/interfaces/deviceInterface';
import { API_INTERFACES } from '../../../../public/constants';
import { HIGH_CONTRAST } from '../../constants/browserStorage';
import { PublicDigitalTwinsModelRepoHelper, PublicDigitalTwinsModelInterface } from '../services/publicDigitalTwinsModelRepoHelper';

export const NOT_AVAILABLE = 'Feature is not available in this configuration';

export const getSettingsInterface = (): SettingsInterface => {
    // Always use the Electron interface since we only support Electron now
    const electronInterface = getElectronInterface<SettingsInterface>(API_INTERFACES.SETTINGS);
    if (electronInterface) {
        return electronInterface;
    }
    // Fallback for testing or non-Electron environments
    return getSettingsInterfaceForBrowser();
};

export const getSettingsInterfaceForBrowser = (): SettingsInterface => {
    return ({
        useHighContrast: async (): Promise<boolean> => {
            const result = localStorage.getItem(HIGH_CONTRAST) === 'true';
            return Promise.resolve(result);
        }
    });
};

export const getPublicDigitalTwinsModelInterface = (): PublicDigitalTwinsModelInterface => {
    return new PublicDigitalTwinsModelRepoHelper();
};

export const getAuthenticationInterface = (): AuthenticationInterface => {
    const electronInterface = getElectronInterface<AuthenticationInterface>(API_INTERFACES.AUTHENTICATION);
    if (!electronInterface) {
        throw new Error(NOT_AVAILABLE);
    }
    return electronInterface;
};

export const getCredentialsInterface = (): CredentialsInterface => {
    const electronInterface = getElectronInterface<CredentialsInterface>(API_INTERFACES.CREDENTIALS);
    if (!electronInterface) {
        throw new Error(NOT_AVAILABLE);
    }
    return electronInterface;
};

export const getDeviceInterface = (): DeviceInterface => {
    const electronInterface = getElectronInterface<DeviceInterface>(API_INTERFACES.DEVICE);
    if (!electronInterface) {
        throw new Error(NOT_AVAILABLE);
    }
    return electronInterface;
};

export const getElectronInterface = <T>(name: string): T => {
    // tslint:disable-next-line: no-any no-string-literal
    const api = (window as any)[name];
    return api as T;
};
