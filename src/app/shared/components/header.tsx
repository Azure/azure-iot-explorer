/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import NotificationListContainer from '../../notifications/components/notificationListContainer';
import SettingsPane from '../../settings/components/settingsPane';
import '../../css/_header.scss';

export const Header: React.FC = () => {
    return (
        <LocalizationContextConsumer>
            {(context: LocalizationContextInterface) => (
                <header className="header">
                    <div className="title">{context.t(ResourceKeys.header.applicationName)}</div>
                    <div><NotificationListContainer /></div>
                    <div><SettingsPane/></div>
                </header>

            )}
        </LocalizationContextConsumer>
    );
};
