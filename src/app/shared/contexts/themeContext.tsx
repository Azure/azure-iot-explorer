/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IPartialTheme } from '@fluentui/react';
import { THEME_DARK, THEME_LIGHT, THEME_DARK_HC, THEME_LIGHT_HC } from '../../constants/themes';

export enum Theme {
    light = 'light',
    dark = 'dark',
    highContrastBlack = 'highContrastBlack',
    highContrastWhite = 'highContrastWhite'
}
export enum EditorTheme {
    light = 'xcode',
    dark = 'twilight',
    hc_black = 'twilight'
}

export interface ThemeProperties {
    theme: Theme;
    editorTheme: EditorTheme;
    fabricTheme: IPartialTheme;
}

export interface ThemeContextInterface extends ThemeProperties {
    updateTheme: (isDarkTheme: boolean) => void;
}

export const ThemeProperties: Record<Theme, ThemeProperties> = {
    [Theme.dark]: {
        editorTheme: EditorTheme.dark,
        fabricTheme: THEME_DARK,
        theme: Theme.dark
    },
    [Theme.highContrastBlack]: {
        editorTheme: EditorTheme.hc_black,
        fabricTheme: THEME_DARK_HC,
        theme: Theme.highContrastBlack
    },
    [Theme.highContrastWhite]: {
        editorTheme: EditorTheme.hc_black,
        fabricTheme: THEME_LIGHT_HC,
        theme: Theme.highContrastWhite
    },
    [Theme.light]: {
        editorTheme: EditorTheme.light,
        fabricTheme: THEME_LIGHT,
        theme: Theme.light
    }
};

export const ThemeContext = React.createContext<ThemeContextInterface>({
    editorTheme: undefined,
    fabricTheme: undefined,
    theme: undefined,
    updateTheme: (isDarkTheme: boolean) => undefined
});
export const ThemeContextProvider = ThemeContext.Provider;
export const useThemeContext = () => React.useContext(ThemeContext);
