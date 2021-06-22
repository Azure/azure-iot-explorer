/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar } from '@fluentui/react';
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

export const DeviceListCommandBar: React.FC<DeviceListCommandBarDataProps & DeviceListCommandBarActionProps> = (props: DeviceListCommandBarDataProps & DeviceListCommandBarActionProps) => {
    const { t } = useTranslation();

    const { disableAdd, disableDelete, disableRefresh, handleAdd, handleDelete, handleRefresh } = props;

    return (
        <CommandBar
            items={[
                {
                    ariaLabel: t(ResourceKeys.deviceLists.commands.add),
                    disabled: disableAdd,
                    iconProps: {
                        iconName: ArrayOperation.ADD
                    },
                    key: ArrayOperation.ADD,
                    name: t(ResourceKeys.deviceLists.commands.add),
                    onClick: handleAdd
                },
                {
                    ariaLabel: t(ResourceKeys.deviceLists.commands.refresh),
                    disabled: disableRefresh,
                    iconProps: {
                        iconName: REFRESH
                    },
                    key: REFRESH,
                    name: t(ResourceKeys.deviceLists.commands.refresh),
                    onClick: handleRefresh
                },
                {
                    ariaLabel: t(ResourceKeys.deviceLists.commands.delete.buttonText),
                    disabled: disableDelete,
                    iconProps: {
                        iconName: ArrayOperation.REMOVE
                    },
                    key: ArrayOperation.REMOVE,
                    name: t(ResourceKeys.deviceLists.commands.delete.buttonText),
                    onClick: handleDelete
                },
            ]}
        />
    );
};
