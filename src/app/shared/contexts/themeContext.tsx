/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IPartialTheme } from 'office-ui-fabric-react/lib/Styling';

export enum Theme {
    light = 'light',
    dark = 'dark',
}
export enum MonacoTheme {
    light = 'vs-light',
    dark = 'vs-dark',
}

export interface ThemeContextInterface {
    theme: Theme;
    monacoTheme: MonacoTheme;
    fabricTheme: IPartialTheme;
    updateTheme: (isDarkTheme: boolean) => void;
}

export const ThemeContext = React.createContext({});
export const ThemeContextProvider = ThemeContext.Provider;
export const ThemeContextConsumer = ThemeContext.Consumer;
