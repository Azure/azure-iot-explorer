/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { useLocalizationContext } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SAVE } from '../../../constants/iconNames';

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
    const { t } = useLocalizationContext();
    const { handleSave, onRegeneratePrimaryKey, onRegenerateSecondaryKey, onSwapKeys, disableSave } = props;

    const allowKeyManagement: boolean = !!onRegeneratePrimaryKey || !!onRegenerateSecondaryKey || !!onSwapKeys;

    const items: ICommandBarItemProps[] = [
        {
            ariaLabel: t(ResourceKeys.deviceIdentity.commands.save),
            disabled: disableSave,
            iconProps: {
                iconName: SAVE
            },
            key: SAVE,
            name: t(ResourceKeys.deviceIdentity.commands.save),
            onClick: handleSave
        },
        {
            ariaLabel: t(ResourceKeys.deviceIdentity.commands.manageKeys.ariaLabel),
            disabled: !allowKeyManagement,
            iconProps: {
                iconName: 'Permissions'
            },
            key: 'manageKeys',
            name: t(ResourceKeys.deviceIdentity.commands.manageKeys.label),
            subMenuProps: {
                items: [
                    {
                        ariaLabel: t(ResourceKeys.deviceIdentity.commands.regeneratePrimary.ariaLabel),
                        disabled: !onRegeneratePrimaryKey,
                        iconProps: {
                            iconName: 'AzureKeyVault'
                        },
                        key: 'regeneratePrimary',
                        name: t(ResourceKeys.deviceIdentity.commands.regeneratePrimary.label),
                        onClick: onRegeneratePrimaryKey
                    },
                    {
                        ariaLabel: t(ResourceKeys.deviceIdentity.commands.regenerateSecondary.ariaLabel),
                        disabled: !onRegenerateSecondaryKey,
                        iconProps: {
                            iconName: 'AzureKeyVault'
                        },
                        key: 'regenerateSecondary',
                        name: t(ResourceKeys.deviceIdentity.commands.regenerateSecondary.label),
                        onClick: onRegenerateSecondaryKey
                    },
                    {
                        ariaLabel: t(ResourceKeys.deviceIdentity.commands.swapKeys.ariaLabel),
                        disabled: !onSwapKeys,
                        iconProps: {
                            iconName: 'SwitcherStartEnd'
                        },
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
