/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';
import { useTranslation } from 'react-i18next';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SaveRegular, KeyRegular, ArrowSwapRegular } from '@fluentui/react-icons';
import { SAVE } from '../../../constants/commandBarItemKeys';

export interface DeviceIdentityCommandBarDataProps {
    disableSave?: boolean;
}

export interface DeviceIdentityCommandBarActionProps {
    handleSave: () => void;
    onRegeneratePrimaryKey?(): void;
    onRegenerateSecondaryKey?(): void;
    onSwapKeys?(): void;
}

export const DeviceIdentityCommandBar: React.FC<DeviceIdentityCommandBarDataProps & DeviceIdentityCommandBarActionProps> = (props: DeviceIdentityCommandBarDataProps & DeviceIdentityCommandBarActionProps) => {
    const { t } = useTranslation();
    const { handleSave, onRegeneratePrimaryKey, onRegenerateSecondaryKey, onSwapKeys, disableSave } = props;

    const allowKeyManagement: boolean = !!onRegeneratePrimaryKey || !!onRegenerateSecondaryKey || !!onSwapKeys;

    const items = [
        {
            ariaLabel: t(ResourceKeys.deviceIdentity.commands.save),
            disabled: disableSave,
            icon: <SaveRegular />,
            key: SAVE,
            name: t(ResourceKeys.deviceIdentity.commands.save),
            onClick: handleSave
        },
        {
            ariaLabel: t(ResourceKeys.deviceIdentity.commands.manageKeys.ariaLabel),
            disabled: !allowKeyManagement,
            icon: <KeyRegular />,
            key: 'manageKeys',
            name: t(ResourceKeys.deviceIdentity.commands.manageKeys.label),
            subMenuProps: {
                items: [
                    {
                        ariaLabel: t(ResourceKeys.deviceIdentity.commands.regeneratePrimary.ariaLabel),
                        disabled: !onRegeneratePrimaryKey,
                        icon: <KeyRegular />,
                        key: 'regeneratePrimary',
                        name: t(ResourceKeys.deviceIdentity.commands.regeneratePrimary.label),
                        onClick: onRegeneratePrimaryKey
                    },
                    {
                        ariaLabel: t(ResourceKeys.deviceIdentity.commands.regenerateSecondary.ariaLabel),
                        disabled: !onRegenerateSecondaryKey,
                        icon: <KeyRegular />,
                        key: 'regenerateSecondary',
                        name: t(ResourceKeys.deviceIdentity.commands.regenerateSecondary.label),
                        onClick: onRegenerateSecondaryKey
                    },
                    {
                        ariaLabel: t(ResourceKeys.deviceIdentity.commands.swapKeys.ariaLabel),
                        disabled: !onSwapKeys,
                        icon: <ArrowSwapRegular />,
                        key: 'swapKeys',
                        name: t(ResourceKeys.deviceIdentity.commands.swapKeys.label),
                        onClick: onSwapKeys
                    }
                ]
            }
        }
    ];

    return (
        <CommandBar items={items} />
    );
};
