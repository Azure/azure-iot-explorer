/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { BoxRegular, ArrowSyncRegular, DeleteRegular } from '@fluentui/react-icons';
import { REFRESH } from '../../../constants/iconNames';

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
                    icon: <BoxRegular />,
                    key: 'add',
                    name: t(ResourceKeys.deviceLists.commands.add),
                    onClick: handleAdd
                },
                {
                    ariaLabel: t(ResourceKeys.deviceLists.commands.refresh),
                    disabled: disableRefresh,
                    icon: <ArrowSyncRegular />,
                    key: REFRESH,
                    name: t(ResourceKeys.deviceLists.commands.refresh),
                    onClick: handleRefresh
                },
                {
                    ariaLabel: t(ResourceKeys.deviceLists.commands.delete.buttonText),
                    disabled: disableDelete,
                    icon: <DeleteRegular />,
                    key: 'delete',
                    name: t(ResourceKeys.deviceLists.commands.delete.buttonText),
                    onClick: handleDelete
                },
            ]}
        />
    );
};
