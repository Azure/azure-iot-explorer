/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { IPartialTheme, createTheme } from 'office-ui-fabric-react/lib/Styling';
import { SCOPED_SETTINGS, THEME_DARK, THEME_LIGHT, THEME_DARK_HC, THEME_LIGHT_HC } from './app/constants/themes';
import { Theme, MonacoTheme, ThemeContextProvider } from './app/shared/contexts/themeContext';
import { THEME_SELECTION, HIGH_CONTRAST } from './app/constants/browserStorage';

interface ThemerState {
    theme: Theme;
    fabricTheme: IPartialTheme;
    monacoTheme: MonacoTheme;
}
export default class Themer extends React.Component<{}, ThemerState> {

    // tslint:disable-next-line: cyclomatic-complexity
    public constructor(props: {}) {
        super(props);
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
        console.log(theme); //tslint:disable-line
        this.state = this.getThemeState(theme);
        console.log(this.state.fabricTheme); //tslint:disable-line
        this.setBodyClass(theme);
    }

    public getThemeState = (theme: Theme) => {
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
    }

    public render(): JSX.Element {
        const currentTheme = createTheme(this.state.fabricTheme);

        return (
            <Customizer settings={{ theme: { ...currentTheme } }} scopedSettings={{ ...SCOPED_SETTINGS }}>
                <Fabric>
                    <ThemeContextProvider value={{ ...this.state, updateTheme: this.updateThemeHandler }}>
                        {this.props.children}
                    </ThemeContextProvider>
                </Fabric>
            </Customizer>
        );
    }

    public selectTheme = (isDarkMode: boolean, isHighContrast: boolean) => {
        return isDarkMode && isHighContrast ?
            Theme.highContrastBlack :
            isHighContrast ? Theme.highContrastWhite :
            isDarkMode ? Theme.dark : Theme.light;
    }

    public updateThemeHandler = (isDarkMode: boolean) => {
        const isHighContrast = localStorage.getItem(HIGH_CONTRAST) === 'true';
        const theme = this.selectTheme(isDarkMode, isHighContrast);
        this.setBodyClass(theme);
        this.setState(
            this.getThemeState(theme),
            () => {
                localStorage.setItem(THEME_SELECTION, theme);
            }
        );
    }

    private readonly setBodyClass = (theme: Theme) => {
        for (const removedTheme in Theme) {
            if (theme !== removedTheme) {
                document.body.classList.remove(`theme-${removedTheme}`);
            }
        }
        if (!document.body.classList.contains(`theme-${theme}`)) {
            document.body.classList.add(`theme-${theme}`);
        }
    }
}
