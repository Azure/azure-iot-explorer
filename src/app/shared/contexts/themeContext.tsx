/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IPartialTheme } from 'office-ui-fabric-react/lib/Styling';

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

export interface ThemeContextInterface {
    theme: Theme;
    editorTheme: EditorTheme;
    fabricTheme: IPartialTheme;
    updateTheme: (isDarkTheme: boolean) => void;
}

export const ThemeContext = React.createContext({
    editorTheme: undefined,
    fabricTheme: undefined,
    theme: undefined,
    updateTheme: (isDarkTheme: boolean) => undefined
});
export const ThemeContextProvider = ThemeContext.Provider;
export const useThemeContext = () => React.useContext(ThemeContext);
