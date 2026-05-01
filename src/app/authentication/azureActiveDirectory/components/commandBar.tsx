/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { useAuthenticationStateContext } from '../../context/authenticationStateContext';
import { ArrowLeftRegular, SignOutRegular, PersonRegular } from '@fluentui/react-icons';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';

export const AzureActiveDirectoryCommandBar: React.FC = () => {
    const { t } = useTranslation();
    const [ , { setLoginPreference } ] = useAuthenticationStateContext();
    const [{ token }, { logout, login }] =  useAzureActiveDirectoryStateContext();

    const switchAuth = () => {
        setLoginPreference('');
    };

    const getCommandBarItems = () => {
        const items = [{
            ariaLabel: t(ResourceKeys.authentication.authSelection.switchAuthType),
            icon: <ArrowLeftRegular />,
            key: 'switch',
            onClick: switchAuth,
            text: t(ResourceKeys.authentication.authSelection.switchAuthType)
        }];

        return token ? [{
            ariaLabel: t(ResourceKeys.authentication.azureActiveDirectory.command.logout),
            icon: <SignOutRegular />,
            key: 'signout',
            onClick: logout,
            text: t(ResourceKeys.authentication.azureActiveDirectory.command.logout)
            }, ...items] :
            [{
                ariaLabel: t(ResourceKeys.authentication.azureActiveDirectory.command.login),
                icon: <PersonRegular />,
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
