/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { THEME_SELECTION } from '../../constants/browserStorage';
import { Theme } from '../../shared/contexts/themeContext';
import { getSettingsInterface } from '../shared/interfaceUtils';

// high contrast either comes from native app or storage;
export const getHighContrastSetting = async (): Promise<boolean> => {
    const api = getSettingsInterface();
    const useHighContrast = await api.useHighContrast();
    return useHighContrast;
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
