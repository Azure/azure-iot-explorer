/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SettingsInterface } from '../../../../public/interfaces/settingsInterface';
import { AuthenticationInterface } from './../../../../public/interfaces/authenticationInterface';
import { API_INTERFACES } from '../../../../public/constants';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { HIGH_CONTRAST } from '../../constants/browserStorage';
import { PublicDigitalTwinsModelRepoHelper, PublicDigitalTwinsModelInterface } from '../services/publicDigitalTwinsModelRepoHelper';

export const NOT_AVAILABLE = 'Feature is not available in this configuration';

export const getSettingsInterface = (): SettingsInterface => {
    return appConfig.hostMode === HostMode.Electron ?
        getElectronInterface(API_INTERFACES.SETTINGS) :
        getSettingsInterfaceForBrowser();
};

export const getSettingsInterfaceForBrowser = (): SettingsInterface => {
    return ({
        getApiAuthToken: async (): Promise<string | null> => {
            return Promise.resolve(null);
        },
        getApiCertFingerprint: async (): Promise<string | null> => {
            return Promise.resolve(null);
        },
        getApiCertificate: async (): Promise<string | null> => {
            return Promise.resolve(null);
        },
        getCustomPort: async (): Promise<number | null> => {
            return Promise.resolve(null);
        },
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
    if (appConfig.hostMode !== HostMode.Electron) {
        throw new Error(NOT_AVAILABLE);
    }

    return getElectronInterface(API_INTERFACES.AUTHENTICATION);
};

export const getElectronInterface = <T>(name: string): T => {
    // tslint:disable-next-line: no-any no-string-literal
    const api = (window as any)[name];
    return api as T;
};
