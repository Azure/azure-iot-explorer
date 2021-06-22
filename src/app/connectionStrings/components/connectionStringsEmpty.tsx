/***********************************************************
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License
**********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@fluentui/react';
import { NavLink } from 'react-router-dom';
import { ResourceKeys } from '../../../localization/resourceKeys';
import './connectionStringsEmpty.scss';

export const ConnectionStringsEmpty: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="connection-strings-empty">
            <h3 role="heading" aria-level={1}>{t(ResourceKeys.connectionStrings.empty.header)}</h3>
            <div>
                <span>{t(ResourceKeys.connectionStrings.empty.description)}</span>
                <NavLink to="/" className="embedded-link">Home.</NavLink>
            </div>

            <h3 role="heading" aria-level={1}>{t(ResourceKeys.settings.questions.headerText)}</h3>
            <Link
                href={t(ResourceKeys.connectivityPane.connectionStringComboBox.link)}
                target="_blank"
            >
                {t(ResourceKeys.connectivityPane.connectionStringComboBox.linkText)}
            </Link>
        </div>
    );
};
