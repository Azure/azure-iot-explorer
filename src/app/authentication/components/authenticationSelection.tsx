/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CompoundButton, Link } from '@fluentui/react-components';
import { KeyRegular, OrganizationRegular } from '@fluentui/react-icons';
import { useTranslation, Trans } from 'react-i18next';
import { useAuthenticationStateContext } from '../context/authenticationStateContext';
import { AuthenticationMethodPreference } from '../state';
import { ResourceKeys } from '../../../localization/resourceKeys';
import './authenticationSelection.scss';

export const AuthenticationSelection: React.FC = () => {
    const [, { setLoginPreference }] = useAuthenticationStateContext();
    const { t } = useTranslation();

    const connectViaConnectionString = () => {
        setLoginPreference(AuthenticationMethodPreference.ConnectionString);
    };

    const loginViaAad = () => {
        setLoginPreference(AuthenticationMethodPreference.AzureAD);
    };

    return (
        <div className="auth-slection-container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 role="heading" aria-level={1}>{t(ResourceKeys.authentication.authSelection.header)}</h3>
                <div>
                    <Trans components={[<Link key="0" href="https://aka.ms/iothubPermissions" target="_blank"/>]}>
                        {ResourceKeys.authentication.authSelection.subText}
                    </Trans>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '80px' }}>
                    <CompoundButton
                        appearance="primary"
                        icon={<KeyRegular />}
                        onClick={connectViaConnectionString}
                        className="auth-selection-tile"
                    >
                        {t(ResourceKeys.authentication.authSelection.selection.connectionString)}
                    </CompoundButton>
                    <CompoundButton
                        icon={<OrganizationRegular />}
                        className="auth-selection-tile"
                        onClick={loginViaAad}
                    >
                        {t(ResourceKeys.authentication.authSelection.selection.azureActiveDirectory)}
                    </CompoundButton>
                </div>
            </div>
        </div>
    );
};
