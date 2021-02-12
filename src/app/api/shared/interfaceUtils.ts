/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SettingsInterface } from '../../../../public/interfaces/settingsInterface';
import { DeviceInterface } from '../../../../public/interfaces/deviceInterface';
import { DirectoryInterface } from '../../../../public/interfaces/directoryInterface';
import { ModelRepositoryInterface } from '../../../../public/interfaces/modelRepositoryInterface';
import { API_INTERFACES } from '../../../../public/constants';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { HIGH_CONTRAST } from '../../constants/browserStorage';

export const NOT_AVAILABLE = 'Feature is not available in this configuration';

export const getSettingsInterface = (): SettingsInterface => {
    return appConfig.hostMode === HostMode.Electron ?
        getSettingsInterfaceForElectron() :
        getSettingsInterfaceForBrowser();
};

export const getSettingsInterfaceForElectron = (): SettingsInterface => {
    // tslint:disable-next-line: no-any no-string-literal
    const api = (window as any)[API_INTERFACES.SETTINGS];
    return api as SettingsInterface;
};

export const getSettingsInterfaceForBrowser = (): SettingsInterface => {
    return ({
        useHighContrast: async (): Promise<boolean> => {
            const result = localStorage.getItem(HIGH_CONTRAST) === 'true';
            return Promise.resolve(result);
        }
    });
};

export const getDeviceInterface = (): DeviceInterface => {
    if (appConfig.hostMode !== HostMode.Electron) {
        throw new Error(NOT_AVAILABLE);
    }
    // tslint:disable-next-line: no-any no-string-literal
    const api = (window as any)[API_INTERFACES.DEVICE];
    return api as DeviceInterface;
};

export const getLocalModelRepositoryInterface = (): ModelRepositoryInterface => {
    if (appConfig.hostMode !== HostMode.Electron) {
        throw new Error(NOT_AVAILABLE);
    }
    // tslint:disable-next-line: no-any no-string-literal
    const api = (window as any)[API_INTERFACES.MODEL_DEFINITION];
    return api as ModelRepositoryInterface;
};

export const getDirectoryInterface = (): DirectoryInterface => {
    if (appConfig.hostMode !== HostMode.Electron) {
        throw new Error(NOT_AVAILABLE);
    }

    // tslint:disable-next-line: no-any no-string-literal
    const api = (window as any)[API_INTERFACES.DIRECTORY];
    return api as DirectoryInterface;
};
