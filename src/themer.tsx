/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { IPartialTheme, createTheme } from 'office-ui-fabric-react/lib/Styling';
import { SCOPED_SETTINGS, THEME_DARK, THEME_LIGHT } from './app/constants/themes';

export enum Theme {
    light = 'light',
    dark = 'dark',
}

interface ThemeState {
    officeTheme: IPartialTheme;
}
interface ThemeProps {
    theme: Theme;
}

export default class Themer extends React.Component<ThemeProps, ThemeState> {

    public constructor(props: ThemeProps) {
        super(props);
        this.state = {
            officeTheme: this.props.theme === Theme.dark ? THEME_DARK : THEME_LIGHT,
        };
    }

    public render(): JSX.Element {
        const currentTheme = createTheme(this.state.officeTheme);

        return (
            <Customizer settings={{ theme: { ...currentTheme }}} scopedSettings={{...SCOPED_SETTINGS}}>
                <Fabric>
                    <div className={this.props.theme === Theme.dark ? 'theme-dark' : 'theme-light'}>
                        {this.props.children}
                    </div>
                </Fabric>
            </Customizer>
        );
    }

    public componentWillReceiveProps(newProps: ThemeProps) {
        return this.setState({
            officeTheme: newProps.theme === Theme.dark ? THEME_DARK : THEME_LIGHT,
        });
    }
}
