/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CompoundButton, Stack } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
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
            <Stack tokens={{ childrenGap: 10 }}>
                <h3 role="heading" aria-level={1}>{t(ResourceKeys.authentication.autheSelection.header)}</h3>
                <span>{t(ResourceKeys.authentication.autheSelection.subText)}</span>
                <Stack tokens={{ childrenGap: 80 }} horizontal={true} >
                    <CompoundButton
                        primary={true}
                        iconProps={{ iconName: 'Permissions' }}
                        onClick={connectViaConnectionString}
                        className="auth-selection-tile"
                    >
                        {t(ResourceKeys.authentication.autheSelection.selection.connectionString)}
                    </CompoundButton>
                    <CompoundButton
                        iconProps={{ iconName: 'AADLogo' }}
                        className="auth-selection-tile"
                        onClick={loginViaAad}
                    >
                        {t(ResourceKeys.authentication.autheSelection.selection.azureActiveDirectory)}
                    </CompoundButton>
                </Stack>
            </Stack>
        </div>
    );
};
