/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SettingsInterface } from '../../../../public/interfaces/settingsInterface';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { THEME_SELECTION, HIGH_CONTRAST } from '../../constants/browserStorage';
import { Theme } from '../../shared/contexts/themeContext';

export const getSettingsInterface = (): SettingsInterface => {
    return appConfig.hostMode === HostMode.Electron ?
        getSettingsInterfaceForElectron() :
        getSettingsInterfaceForBrowser();
};

export const getSettingsInterfaceForElectron = (): SettingsInterface => {
     // tslint:disable-next-line: no-any
    const api = (window as any).settings;
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

// high contrast either comes from native app or storage;
export const getHighContrastSetting = async (): Promise<boolean> => {
    const settings = getSettingsInterface();
    return settings.useHighContrast();
};

// theme settings stored in local storage;
export const getDarkModeSetting = (): boolean => {
    const theme = localStorage.getItem(THEME_SELECTION) as Theme || Theme.light;
    return theme === Theme.dark || theme === Theme.highContrastBlack;
};

export const setDarkModeSetting = (value: boolean) => {
    const theme = value ? Theme.dark : Theme.light;
    localStorage.setItem(THEME_SELECTION, theme);
};
