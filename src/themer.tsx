/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { IPartialTheme, createTheme } from 'office-ui-fabric-react/lib/Styling';
import { SCOPED_SETTINGS } from './app/constants/themes';

export enum Theme {
    light = 'light',
    dark = 'dark',
}
interface ThemeProps {
    officeTheme: IPartialTheme;
    theme: Theme;
}

export default class Themer extends React.Component<ThemeProps> {

    public constructor(props: ThemeProps) {
        super(props);
    }

    public render(): JSX.Element {
        const currentTheme = createTheme(this.props.officeTheme);

        return (
            <Customizer settings={{ theme: { ...currentTheme }}} scopedSettings={{...SCOPED_SETTINGS}}>
                <Fabric>
                    {this.props.children}
                </Fabric>
            </Customizer>
        );
    }
}
