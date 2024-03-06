/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { useConnectionStringContext } from '../../../../connectionStrings/context/connectionStringContext';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { REFRESH } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { dispatchGetTwinAction } from '../../utils';
import './digitalTwinDetail.scss';

export const Command: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const { pnpState, dispatch, } = usePnpStateContext();
    const [ {connectionString} ] = useConnectionStringContext();
    const twinSynchronizationStatus = pnpState.twin.synchronizationStatus;
    const isTwinLoading = twinSynchronizationStatus === SynchronizationStatus.working;

    const onRefresh = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => {
        dispatchGetTwinAction(search, connectionString, dispatch);
    };

    const createCommandBarItems = (): ICommandBarItemProps[] => {
        return [
            {
                ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
                disabled: isTwinLoading,
                iconProps: {iconName: REFRESH},
                key: REFRESH,
                name: t(ResourceKeys.deviceEvents.command.refresh),
                onClick: onRefresh
            }
        ];
    };

    return (
        <CommandBar
            className="command"
            items={createCommandBarItems()}
        />
    );
};
