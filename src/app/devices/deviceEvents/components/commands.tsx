/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { Announced, CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX, START, STOP, NAVIGATE_BACK, REFRESH, REMOVE, CODE, UPLOAD } from '../../../constants/iconNames';
import { getComponentNameFromQueryString } from '../../../shared/utils/queryStringHelper';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import { getBackUrl } from '../../pnp/utils';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_USER_ACTIONS } from '../../../../app/constants/telemetry';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';
import './deviceEvents.scss';

export interface CommandsProps {
    startDisabled: boolean;
    monitoringData: boolean;
    showSystemProperties: boolean;
    showPnpModeledEvents: boolean;
    showSimulationPanel: boolean;
    showContentTypePanel: boolean;
    setMonitoringData: (monitoringData: boolean) => void;
    setShowSystemProperties: (showSystemProperties: boolean) => void;
    setShowPnpModeledEvents: (showPnpModeledEvents: boolean) => void;
    setShowSimulationPanel: (showSimulationPanel: boolean) => void;
    setShowContentTypePanel: (showDecoderPanel: boolean) => void;
    fetchData(): void;
    stopFetching(): void;
}

export const Commands: React.FC<CommandsProps> = ({
    startDisabled,
    monitoringData,
    showSystemProperties,
    showPnpModeledEvents,
    showSimulationPanel,
    showContentTypePanel,
    setMonitoringData,
    setShowSystemProperties,
    setShowPnpModeledEvents,
    setShowSimulationPanel,
    setShowContentTypePanel,
    fetchData,
    stopFetching}) => {

    const {t} = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const { getModelDefinition } = usePnpStateContext();
    const componentName = getComponentNameFromQueryString(search); // if component name exist, we are in pnp context
    const [ state, api ] = useDeviceEventsStateContext();

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
                createSimulationCommandItem(),
                createContentTypeCommandItem()
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
            ariaLabel: t(ResourceKeys.deviceEvents.command.showSystemProperties.label),
            disabled: state.formMode === 'updating' || showPnpModeledEvents,
            iconProps: {
                iconName: showSystemProperties ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: CHECKED_CHECKBOX,
            name: t(ResourceKeys.deviceEvents.command.showSystemProperties.label),
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
    };

    const createSimulationCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.simulate),
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
            disabled: state.formMode === 'updating',
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

    const createContentTypeCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.customizeContentType),
            disabled: state.formMode !== 'upserted' && state.formMode !== 'initialized'
                        && state.formMode !== 'setDecoderSucceeded' && state.formMode !== 'setDecoderFailed',
            iconProps: {
                iconName: UPLOAD
            },
            key: UPLOAD,
            name: t(ResourceKeys.deviceEvents.command.customizeContentType),
            onClick: onToggleContentTypePanel
        };
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/events\/.*/, ``);
        history.push(getBackUrl(path, search));
    };

    const onToggleStart = () => {
        if (monitoringData) {
            setMonitoringData(false);
            stopFetching();
        } else {
            fetchData();
            setMonitoringData(true);
            if (componentName) {
                AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.PNP_START_TELEMETRY);
            } else {
                AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.START_DEVICE_TELEMETRY);
            }
        }
    };

    const onClearData = () => {
        api.clearEventsMonitoring();
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

    const onToggleContentTypePanel = () => {
        setShowContentTypePanel(!showContentTypePanel);
    };

    return (
        <>
            <CommandBar
                items={createCommandBarItems()}
                farItems={componentName && [createNavigateBackCommandItem()]}
            />
            <Announced message={showSystemProperties ? t(ResourceKeys.deviceEvents.command.showSystemProperties.announce.show) : t(ResourceKeys.deviceEvents.command.showSystemProperties.announce.hide)} />
        </>
    );
};
