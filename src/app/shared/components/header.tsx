/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { Heading } from '../../constants/iconNames';
import NotificationListContainer from '../../notifications/components/notificationListContainer';
import '../../css/_header.scss';

export interface HeaderState {
    settingsVisible: boolean;
}
export interface HeaderProps {
    settingsVisible: boolean;
}

export interface HeaderActions {
    onSettingsVisibilityChanged: (visible: boolean) => void;
}

export default class Header extends React.PureComponent<HeaderProps & HeaderActions, HeaderState> {
    constructor(props: HeaderProps & HeaderActions) {
        super(props);
        this.state = {
            settingsVisible: false
        };
    }
    public render(): JSX.Element {
        const { settingsVisible } = this.props;
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <header className="header">
                        <div className="title">{context.t(ResourceKeys.header.applicationName)}</div>
                        <div><NotificationListContainer /></div>
                        <DefaultButton
                            className={settingsVisible ? 'settings-visible' : ''}
                            id="settings"
                            iconProps={{iconName: settingsVisible ? Heading.SETTINGS_OPEN : Heading.SETTINGS_CLOSED}}
                            onClick={this.showSettings}
                            text={context.t(ResourceKeys.header.settings.launch)}
                            ariaLabel={context.t(ResourceKeys.header.settings.launch)}
                        />
                    </header>

                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly showSettings = () => {
        this.props.onSettingsVisibilityChanged(true);
    }
}
