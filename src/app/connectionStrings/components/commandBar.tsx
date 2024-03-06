import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NAVIGATE_BACK } from '../../constants/iconNames';
import { useAuthenticationStateContext } from '../../authentication/context/authenticationStateContext';

export const ConnectionStringCommandBar: React.FC = () => {
    const { t } = useTranslation();
    const [ , { setLoginPreference } ] = useAuthenticationStateContext();

    const switchAuth = () => {
        setLoginPreference('');
    };

    return (
        <CommandBar
            items={[
                {
                    ariaLabel: t(ResourceKeys.authentication.authSelection.switchAuthType),
                    iconProps: { iconName: NAVIGATE_BACK },
                    key: 'switch',
                    onClick: switchAuth,
                    text: t(ResourceKeys.authentication.authSelection.switchAuthType)
                }
            ]}
        />
    );
};
