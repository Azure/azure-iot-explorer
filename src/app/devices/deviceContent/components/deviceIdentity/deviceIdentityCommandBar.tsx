/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SAVE } from '../../../../constants/iconNames';

export interface DeviceIdentityCommandBarDataProps {
    disableSave?: boolean;
}

export interface DeviceIdentityCommandBarActionProps {
    handleSave: () => void;
    onRegeneratePrimaryKey?(): void;
    onRegenerateSecondaryKey?(): void;
    onSwapKeys?(): void;
}

export default class DeviceIdentityCommandBar extends React.Component<DeviceIdentityCommandBarDataProps & DeviceIdentityCommandBarActionProps> {
    constructor(props: DeviceIdentityCommandBarDataProps & DeviceIdentityCommandBarActionProps) {
        super(props);
    }

    public render() {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    this.showCommandBar(context)
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        const { onRegeneratePrimaryKey, onRegenerateSecondaryKey, onSwapKeys } = this.props;
        const allowKeyManagement: boolean = !!onRegeneratePrimaryKey || !!onRegenerateSecondaryKey || !!onSwapKeys;

        const items = [
            {
                ariaLabel: context.t(ResourceKeys.deviceLists.commands.add),
                disabled: this.props.disableSave,
                iconProps: {
                    iconName: SAVE
                },
                key: SAVE,
                name: context.t(ResourceKeys.deviceIdentity.commands.save),
                onClick: this.props.handleSave
            },
            {
                ariaLabel: context.t(ResourceKeys.deviceIdentity.commands.manageKeys.ariaLabel),
                disabled: !allowKeyManagement,
                iconProps: {
                    iconName: 'Permissions'
                },
                key: 'manageKeys',
                name: context.t(ResourceKeys.deviceIdentity.commands.manageKeys.label),
                subMenuProps: {
                    items: [
                        {
                            ariaLabel: context.t(ResourceKeys.deviceIdentity.commands.regeneratePrimary.ariaLabel),
                            disabled: !onRegeneratePrimaryKey,
                            iconProps: {
                                iconName: 'AzureKeyVault'
                            },
                            key: 'regeneratePrimary',
                            name: context.t(ResourceKeys.deviceIdentity.commands.regeneratePrimary.label),
                            onClick: onRegeneratePrimaryKey
                        },
                        {
                            ariaLabel: context.t(ResourceKeys.deviceIdentity.commands.regenerateSecondary.ariaLabel),
                            disabled: !onRegenerateSecondaryKey,
                            iconProps: {
                                iconName: 'AzureKeyVault'
                            },
                            key: 'regenerateSecondary',
                            name: context.t(ResourceKeys.deviceIdentity.commands.regenerateSecondary.label),
                            onClick: onRegenerateSecondaryKey
                        },
                        {
                            ariaLabel: context.t(ResourceKeys.deviceIdentity.commands.swapKeys.ariaLabel),
                            disabled: !onSwapKeys,
                            iconProps: {
                                iconName: 'SwitcherStartEnd'
                            },
                            key: 'swapKeys',
                            name: context.t(ResourceKeys.deviceIdentity.commands.swapKeys.label),
                            onClick: onSwapKeys
                        }
                    ]
                }
            },
        ];

        return (
            <CommandBar items={items} />
        );
    }
}
