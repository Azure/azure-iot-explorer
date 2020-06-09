/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationList } from '../../notifications/components/notificationList';
import { SettingsPane } from '../../settings/components/settingsPane';
import { useLocalizationContext } from '../contexts/localizationContext';
import '../../css/_header.scss';

export const Header: React.FC = () => {
    const { t } = useLocalizationContext();

    return (
        <header className="header">
            <div className="title">{t(ResourceKeys.header.applicationName)}</div>
            <div><NotificationList/></div>
            <div><SettingsPane/></div>
        </header>
    );
};
