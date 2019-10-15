/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { IPartialTheme, createTheme } from 'office-ui-fabric-react/lib/Styling';
import { SCOPED_SETTINGS, THEME_DARK, THEME_LIGHT } from './app/constants/themes';
import { Theme, MonacoTheme, ThemeContextProvider } from './app/shared/contexts/themeContext';
import { THEME_SELECTION } from './app/constants/browserStorage';

interface ThemerState {
    theme: Theme;
    fabricTheme: IPartialTheme;
    monacoTheme: MonacoTheme;
}
export default class Themer extends React.Component<{}, ThemerState> {

    // tslint:disable-next-line: cyclomatic-complexity
    public constructor(props: {}) {
        super(props);
        let theme = localStorage.getItem(THEME_SELECTION);
        if (!theme) {
            theme = document.body.classList.contains('theme-dark') ? Theme.dark : Theme.light;
        }
        this.state = {
            fabricTheme: theme === Theme.dark ? THEME_DARK : THEME_LIGHT,
            monacoTheme: theme === Theme.dark ? MonacoTheme.dark : MonacoTheme.light,
            theme: theme === Theme.dark ? Theme.dark : Theme.light
        };
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

    // tslint:disable-next-line: no-any
    public updateThemeHandler = (isDarkMode: boolean) => {
        const theme = isDarkMode ? Theme.dark : Theme.light;
        this.setBodyClass(theme);
        this.setState(
            {
                fabricTheme: theme === Theme.dark ? THEME_DARK : THEME_LIGHT,
                monacoTheme: theme === Theme.dark ? MonacoTheme.dark : MonacoTheme.light,
                theme
            },
            () => {
                localStorage.setItem(THEME_SELECTION, theme);
            }
        );
    }

    private readonly setBodyClass = (theme: Theme) => {
        document.body.classList.remove(`theme-${theme === Theme.dark ? Theme.light : Theme.dark}`);
        if (!document.body.classList.contains(`theme-${theme}`)) {
            document.body.classList.add(`theme-${theme}`);
        }
    }
}
