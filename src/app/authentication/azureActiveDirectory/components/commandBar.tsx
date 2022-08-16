/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { useAuthenticationStateContext } from '../../context/authenticationStateContext';
import { NAVIGATE_BACK } from '../../../constants/iconNames';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';

export const AzureActiveDirectoryCommandBar: React.FC = () => {
    const { t } = useTranslation();
    const [ , { setLoginPreference } ] = useAuthenticationStateContext();
    const [ { token }, { logout, login }] =  useAzureActiveDirectoryStateContext();

    const switchAuth = () => {
        setLoginPreference('');
    };

    const getCommandBarItems = () => {
        const items = [{
            ariaLabel: t(ResourceKeys.authentication.autheSelection.switchAuthType),
            iconProps: { iconName: NAVIGATE_BACK },
            key: 'switch',
            onClick: switchAuth,
            text: t(ResourceKeys.authentication.autheSelection.switchAuthType)
        }];

        return token ? [{
            ariaLabel: t(ResourceKeys.authentication.azureActiveDirectory.command.logout),
            iconProps: { iconName: 'Signout' },
            key: 'signout',
            onClick: logout,
            text: t(ResourceKeys.authentication.azureActiveDirectory.command.logout)
            }, ...items] :
            [{
                ariaLabel: t(ResourceKeys.authentication.azureActiveDirectory.command.login),
                iconProps: { iconName: 'Signin' },
                key: 'signin',
                onClick: login,
                text: t(ResourceKeys.authentication.azureActiveDirectory.command.login)
            }, ...items];
    };

    return (
        <CommandBar
            items={getCommandBarItems()}
        />
    );
};
