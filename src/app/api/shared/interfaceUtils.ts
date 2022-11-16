/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SettingsInterface } from '../../../../public/interfaces/settingsInterface';
import { DirectoryInterface } from '../../../../public/interfaces/directoryInterface';
import { ModelRepositoryInterface } from '../../../../public/interfaces/modelRepositoryInterface';
import { AuthenticationInterface } from './../../../../public/interfaces/authenticationInterface';
import { API_INTERFACES } from '../../../../public/constants';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { HIGH_CONTRAST } from '../../constants/browserStorage';
import { LocalRepoServiceHandler } from '../handlers/localRepoServiceHandler';
import { PublicDigitalTwinsModelRepoHelper, PublicDigitalTwinsModelInterface } from '../services/publicDigitalTwinsModelRepoHelper';

export const NOT_AVAILABLE = 'Feature is not available in this configuration';

export const getSettingsInterface = (): SettingsInterface => {
    return appConfig.hostMode === HostMode.Electron ?
        getElectronInterface(API_INTERFACES.SETTINGS) :
        getSettingsInterfaceForBrowser();
};

export const getSettingsInterfaceForBrowser = (): SettingsInterface => {
    return ({
        useHighContrast: async (): Promise<boolean> => {
            const result = localStorage.getItem(HIGH_CONTRAST) === 'true';
            return Promise.resolve(result);
        }
    });
};

export const getLocalModelRepositoryInterface = (): ModelRepositoryInterface => {
    if (appConfig.hostMode !== HostMode.Electron) {
        return new LocalRepoServiceHandler();
    }

    return getElectronInterface(API_INTERFACES.MODEL_DEFINITION);
};

export const getDirectoryInterface = (): DirectoryInterface => {
    if (appConfig.hostMode !== HostMode.Electron) {
        return new LocalRepoServiceHandler();
    }

    return getElectronInterface(API_INTERFACES.DIRECTORY);
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
