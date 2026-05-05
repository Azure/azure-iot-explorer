/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { ArrowSyncRegular } from '@fluentui/react-icons';
import { REFRESH } from '../../../../constants/commandBarItemKeys';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { dispatchGetTwinAction } from '../../utils';
import './digitalTwinDetail.scss';

export const Command: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const { pnpState, dispatch, } = usePnpStateContext();
    const twinSynchronizationStatus = pnpState.twin.synchronizationStatus;
    const isTwinLoading = twinSynchronizationStatus === SynchronizationStatus.working;

    const onRefresh = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => {
        dispatchGetTwinAction(search, dispatch);
    };

    const createCommandBarItems = () => {
        return [
            {
                ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
                disabled: isTwinLoading,
                icon: <ArrowSyncRegular />,
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
