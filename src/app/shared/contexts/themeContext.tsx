/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';

export enum Theme {
    light = 'light',
    dark = 'dark',
    highContrastBlack = 'highContrastBlack',
    highContrastWhite = 'highContrastWhite'
}

export interface ThemeProperties {
    theme: Theme;
    editorTheme: 'dark' | 'light';
}

export interface ThemeContextInterface extends ThemeProperties {
    updateTheme: (isDarkTheme: boolean) => void;
}

export const ThemeProperties: Record<Theme, ThemeProperties> = {
    [Theme.dark]: {
        editorTheme: 'dark',
        theme: Theme.dark
    },
    [Theme.highContrastBlack]: {
        editorTheme: 'dark',
        theme: Theme.highContrastBlack
    },
    [Theme.highContrastWhite]: {
        editorTheme: 'dark',
        theme: Theme.highContrastWhite
    },
    [Theme.light]: {
        editorTheme: 'light',
        theme: Theme.light
    }
};

export const ThemeContext = React.createContext<ThemeContextInterface>({
    editorTheme: undefined,
    theme: undefined,
    updateTheme: (_isDarkTheme: boolean) => undefined
});
export const ThemeContextProvider = ThemeContext.Provider;
export const useThemeContext = () => React.useContext(ThemeContext);
