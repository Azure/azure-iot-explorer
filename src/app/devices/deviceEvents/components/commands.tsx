/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX, START, STOP, NAVIGATE_BACK, REFRESH, REMOVE, CODE } from '../../../constants/iconNames';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { appConfig, HostMode } from '../../../../appConfig/appConfig';
import { clearMonitoringEventsAction } from './../actions';
import { getComponentNameFromQueryString, getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import './deviceEvents.scss';
import { getBackUrl } from '../../pnp/utils';

export interface CommandsProps {
    startDisabled: boolean;
    synchronizationStatus: SynchronizationStatus;
    monitoringData: boolean;
    showSystemProperties: boolean;
    showPnpModeledEvents: boolean;
    showSimulationPanel: boolean;
    setMonitoringData: (monitoringData: boolean) => void;
    setShowSystemProperties: (showSystemProperties: boolean) => void;
    setShowPnpModeledEvents: (showPnpModeledEvents: boolean) => void;
    setShowSimulationPanel: (showSimulationPanel: boolean) => void;
    dispatch(action: any): void; // tslint:disable-line: no-any
    fetchData(): void;
}

export const Commands: React.FC<CommandsProps> = ({
    startDisabled,
    synchronizationStatus,
    monitoringData,
    showSystemProperties,
    showPnpModeledEvents,
    showSimulationPanel,
    setMonitoringData,
    setShowSystemProperties,
    setShowPnpModeledEvents,
    setShowSimulationPanel,
    dispatch,
    fetchData}) => {

    const {t} = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const { pnpState, getModelDefinition } = usePnpStateContext();
    const componentName = getComponentNameFromQueryString(search); // if component name exist, we are in pnp context
    const deviceId = getDeviceIdFromQueryString(search);

    const createCommandBarItems = (): ICommandBarItemProps[] => {
        if (componentName) {
            return [createStartMonitoringCommandItem(),
                createPnpModeledEventsCommandItem(),
                createSystemPropertiesCommandItem(),
                createRefreshCommandItem(),
                createClearCommandItem()
            ];
        }
        else {
            return [createStartMonitoringCommandItem(),
                createSystemPropertiesCommandItem(),
                createClearCommandItem(),
                createSimulationCommandItem()
            ];
        }
    };

    const createClearCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.clearEvents),
            iconProps: {
                iconName: REMOVE
            },
            key: CLEAR,
            name: t(ResourceKeys.deviceEvents.command.clearEvents),
            onClick: onClearData
        };
    };

    const createSystemPropertiesCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.showSystemProperties),
            disabled: synchronizationStatus === SynchronizationStatus.updating || showPnpModeledEvents,
            iconProps: {
                iconName: showSystemProperties ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: CHECKED_CHECKBOX,
            name: t(ResourceKeys.deviceEvents.command.showSystemProperties),
            onClick: onShowSystemProperties
        };
    };

    const createPnpModeledEventsCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: 'Show modeled events',
            iconProps: {
                iconName: showPnpModeledEvents ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: EMPTY_CHECKBOX,
            name: 'Show modeled events',
            onClick: onShowPnpModeledEvents
        };
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const createStartMonitoringCommandItem = (): ICommandBarItemProps => {
        if (appConfig.hostMode !== HostMode.Browser) {
            const label = monitoringData ? t(ResourceKeys.deviceEvents.command.stop) : t(ResourceKeys.deviceEvents.command.start);
            const icon = monitoringData ? STOP : START;
            return {
                ariaLabel: label,
                disabled: startDisabled,
                iconProps: {
                    iconName: icon
                },
                key: icon,
                name: label,
                onClick: onToggleStart
            };
        }
        else {
            return {
                ariaLabel: t(ResourceKeys.deviceEvents.command.fetch),
                disabled: synchronizationStatus === SynchronizationStatus.updating || monitoringData,
                iconProps: {
                    iconName: START
                },
                key: START,
                name: t(ResourceKeys.deviceEvents.command.fetch),
                onClick: onToggleStart
            };
        }
    };

    const createSimulationCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.clearEvents),
            iconProps: {
                iconName: CODE
            },
            key: t(ResourceKeys.deviceEvents.command.simulate),
            name: t(ResourceKeys.deviceEvents.command.simulate),
            onClick: onToggleSimulationPanel
        };
    };

    const createRefreshCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
            disabled: synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {iconName: REFRESH},
            key: REFRESH,
            name: t(ResourceKeys.deviceEvents.command.refresh),
            onClick: getModelDefinition
        };
    };

    const createNavigateBackCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.close),
            iconProps: {iconName: NAVIGATE_BACK},
            key: NAVIGATE_BACK,
            name: t(ResourceKeys.deviceEvents.command.close),
            onClick: handleClose
        };
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/events\/.*/, ``);
        history.push(getBackUrl(path, search));
    };

    const onToggleStart = () => {
        if (monitoringData) {
            setMonitoringData(false);
        } else {
            fetchData();
            setMonitoringData(true);
        }
    };

    const onClearData = () => {
        dispatch(clearMonitoringEventsAction());
    };

    const onShowSystemProperties = () => {
        setShowSystemProperties(!showSystemProperties);
    };

    const onShowPnpModeledEvents = () => {
        setShowPnpModeledEvents(!showPnpModeledEvents);
    };

    const onToggleSimulationPanel = () => {
        setShowSimulationPanel(!showSimulationPanel);
    };

    return (
        <CommandBar
            items={createCommandBarItems()}
            farItems={componentName && [createNavigateBackCommandItem()]}
        />
    );
};
