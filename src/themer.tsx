/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Fabric, Customizer, createTheme } from 'office-ui-fabric-react';
import { IPartialTheme } from 'office-ui-fabric-react/lib/Styling';
import { SCOPED_SETTINGS, THEME_DARK, THEME_LIGHT } from './app/constants/themes';

export enum Theme {
    light = 'light',
    dark = 'dark',
}

interface ThemeState {
    theme: Theme;
    officeTheme: IPartialTheme;
}

export default class Themer extends React.Component<{}, ThemeState> {

    public constructor(props: {}) {
        super(props);
        this.state = {
            officeTheme: THEME_LIGHT,
            theme: Theme.light
        };

        this.registerThemeChange();
    }

    public render(): JSX.Element {
        const currentTheme = createTheme(this.state.officeTheme);

        return (
            <Customizer settings={{ theme: { ...currentTheme }}} scopedSettings={{...SCOPED_SETTINGS}}>
                <Fabric>
                    <div className={this.state.theme === Theme.dark ? 'theme-dark' : 'theme-light'}>
                        <div className="app">
                            {this.props.children}
                        </div>
                    </div>
                </Fabric>
            </Customizer>
        );
    }

    private registerThemeChange() {
        const theme: IPartialTheme = THEME_DARK; // TODO: allow changing theme and storing theme setting in redux store

        this.setState({
            officeTheme: theme,
            theme: Theme.dark
        });
    }
}
