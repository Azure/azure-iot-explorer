/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { createTheme } from 'office-ui-fabric-react/lib/Styling';
import { SCOPED_SETTINGS, THEME_DARK, THEME_LIGHT, THEME_DARK_HC, THEME_LIGHT_HC } from './app/constants/themes';
import { Theme, MonacoTheme, ThemeContextProvider } from './app/shared/contexts/themeContext';
import { THEME_SELECTION, HIGH_CONTRAST } from './app/constants/browserStorage';

// tslint:disable-next-line: cyclomatic-complexity
const getThemeFromLocalStorage = () => {
    let theme: Theme = localStorage.getItem(THEME_SELECTION) as Theme;
    const isHighContrast = localStorage.getItem(HIGH_CONTRAST) === 'true';

    if (theme) {
        // standardize theme based on high-contrast setting
        if (isHighContrast) {
            if (theme === Theme.dark) {
                theme = Theme.highContrastBlack;
            }
            if (theme === Theme.light) {
                theme = Theme.highContrastWhite;
            }
        } else {
            if (theme === Theme.highContrastBlack) {
                theme = Theme.dark;
            }
            if (theme === Theme.highContrastWhite) {
                theme = Theme.light;
            }
        }
    } else {
        if (isHighContrast) {
            theme = Theme.highContrastWhite;
        } else {
            theme = Theme.light;
        }
    }

    return theme;
};

const getThemeState = (theme: Theme) => {
    // tslint:disable-next-line: no-any
    const themes = {} as any;
    themes[Theme.dark] = {
        fabricTheme: THEME_DARK,
        monacoTheme: MonacoTheme.dark,
        theme: Theme.dark
    };
    themes[Theme.highContrastBlack] = {
        fabricTheme: THEME_DARK_HC,
        monacoTheme: MonacoTheme.hc_black,
        theme: Theme.highContrastBlack
    };

    themes[Theme.highContrastWhite] = {
        fabricTheme: THEME_LIGHT_HC,
        monacoTheme: MonacoTheme.hc_black,
        theme: Theme.highContrastWhite
    };
    themes[Theme.light] = {
        fabricTheme: THEME_LIGHT,
        monacoTheme: MonacoTheme.light,
        theme: Theme.light
    };

    return themes[theme];
};

export const Themer: React.FC = props => {
    const theme = getThemeFromLocalStorage();
    const [ state, setState ] = React.useState(getThemeState(theme));

    React.useEffect(() => {
        setBodyClass(theme);
    },              []);

    const selectTheme = (isDarkMode: boolean, isHighContrast: boolean) => {
        return isDarkMode && isHighContrast ?
            Theme.highContrastBlack :
            isHighContrast ? Theme.highContrastWhite :
            isDarkMode ? Theme.dark : Theme.light;
    };

    const updateThemeHandler = (isDarkMode: boolean) => {
        const isHighContrast = localStorage.getItem(HIGH_CONTRAST) === 'true';
        const newTheme = selectTheme(isDarkMode, isHighContrast);
        setBodyClass(newTheme);
        setState(getThemeState(newTheme));
        localStorage.setItem(THEME_SELECTION, newTheme);
    };

    const setBodyClass = (bodyTheme: Theme) => {
        for (const removedTheme in Theme) {
            if (bodyTheme !== removedTheme) {
                document.body.classList.remove(`theme-${removedTheme}`);
            }
        }
        if (!document.body.classList.contains(`theme-${bodyTheme}`)) {
            document.body.classList.add(`theme-${bodyTheme}`);
        }
    };

    const currentTheme = createTheme(state.fabricTheme);

    return (
        <Customizer settings={{ theme: { ...currentTheme } }} scopedSettings={{ ...SCOPED_SETTINGS }}>
            <Fabric>
                <ThemeContextProvider value={{ ...state, updateTheme: updateThemeHandler }}>
                    {props.children}
                </ThemeContextProvider>
            </Fabric>
        </Customizer>
    );
};
