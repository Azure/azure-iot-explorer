/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ArrayOperation, REFRESH } from '../../../constants/iconNames';

export interface DeviceListCommandBarDataProps {
    disableAdd?: boolean;
    disableRefresh?: boolean;
    disableDelete?: boolean;
}

export interface DeviceListCommandBarActionProps {
    handleAdd: () => void;
    handleRefresh: () => void;
    handleDelete: () => void;
}

export default class DeviceListCommandBar extends React.Component<DeviceListCommandBarDataProps & DeviceListCommandBarActionProps> {
    constructor(props: DeviceListCommandBarDataProps & DeviceListCommandBarActionProps) {
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
        return (
            <CommandBar
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.deviceLists.commands.add),
                        disabled: this.props.disableAdd,
                        iconProps: {
                            iconName: ArrayOperation.ADD
                        },
                        key: ArrayOperation.ADD,
                        name: context.t(ResourceKeys.deviceLists.commands.add),
                        onClick: this.props.handleAdd
                    },
                    {
                        ariaLabel: context.t(ResourceKeys.deviceLists.commands.refresh),
                        disabled: this.props.disableRefresh,
                        iconProps: {
                            iconName: REFRESH
                        },
                        key: REFRESH,
                        name: context.t(ResourceKeys.deviceLists.commands.refresh),
                        onClick: this.props.handleRefresh
                    },
                    {
                        ariaLabel: context.t(ResourceKeys.deviceLists.commands.delete.buttonText),
                        disabled: this.props.disableDelete,
                        iconProps: {
                            iconName: ArrayOperation.REMOVE
                        },
                        key: ArrayOperation.REMOVE,
                        name: context.t(ResourceKeys.deviceLists.commands.delete.buttonText),
                        onClick: this.props.handleDelete
                    },
                ]}
            />
        );
    }
}
