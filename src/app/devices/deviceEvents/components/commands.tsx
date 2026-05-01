/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeleteRegular, CheckboxCheckedRegular, CheckboxUncheckedRegular, PlayRegular, StopFilled, ArrowLeftRegular, ArrowSyncRegular, CodeRegular, ArrowUploadRegular } from '@fluentui/react-icons';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX, START, STOP, NAVIGATE_BACK, REFRESH, UPLOAD } from '../../../constants/iconNames';
import { getComponentNameFromQueryString } from '../../../shared/utils/queryStringHelper';
import { usePnpStateContext } from '../../pnp/context/pnpStateContext';
import { getBackUrl } from '../../pnp/utils';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_USER_ACTIONS } from '../../../../app/constants/telemetry';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';
import './deviceEvents.scss';

export interface CommandsProps {
    startDisabled: boolean;
    monitoringData: boolean;
    showPnpModeledEvents: boolean;
    showSimulationPanel: boolean;
    showContentTypePanel: boolean;
    setMonitoringData: (monitoringData: boolean) => void;
    setShowPnpModeledEvents: (showPnpModeledEvents: boolean) => void;
    setShowSimulationPanel: (showSimulationPanel: boolean) => void;
    setShowContentTypePanel: (showDecoderPanel: boolean) => void;
    fetchData(): void;
    stopFetching(): void;
}

export const Commands: React.FC<CommandsProps> = ({
    startDisabled,
    monitoringData,
    showPnpModeledEvents,
    showSimulationPanel,
    showContentTypePanel,
    setMonitoringData,
    setShowPnpModeledEvents,
    setShowSimulationPanel,
    setShowContentTypePanel,
    fetchData,
    stopFetching}) => {

    const {t} = useTranslation();
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const { getModelDefinition } = usePnpStateContext();
    const componentName = getComponentNameFromQueryString(search); // if component name exist, we are in pnp context
    const [ state, api ] = useDeviceEventsStateContext();

    const createCommandBarItems = () => {
        if (componentName) {
            return [createStartMonitoringCommandItem(),
                createPnpModeledEventsCommandItem(),
                createRefreshCommandItem(),
                createClearCommandItem()
            ];
        }
        else {
            return [createStartMonitoringCommandItem(),
                createClearCommandItem(),
                createSimulationCommandItem(),
                createContentTypeCommandItem()
            ];
        }
    };

    const createClearCommandItem = () => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.clearEvents),
            icon: <DeleteRegular />,
            key: CLEAR,
            name: t(ResourceKeys.deviceEvents.command.clearEvents),
            onClick: onClearData
        };
    };

    const createPnpModeledEventsCommandItem = () => {
        return {
            ariaLabel: 'Show modeled events',
            icon: showPnpModeledEvents ? <CheckboxCheckedRegular /> : <CheckboxUncheckedRegular />,
            key: EMPTY_CHECKBOX,
            name: 'Show modeled events',
            onClick: onShowPnpModeledEvents
        };
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const createStartMonitoringCommandItem = () => {
        const label = monitoringData ? t(ResourceKeys.deviceEvents.command.stop) : t(ResourceKeys.deviceEvents.command.start);
        const icon = monitoringData ? STOP : START;
        return {
            ariaLabel: label,
            disabled: startDisabled,
            icon: monitoringData ? <StopFilled /> : <PlayRegular />,
            key: icon,
            name: label,
            onClick: onToggleStart
        };
    };

    const createSimulationCommandItem = () => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.simulate),
            icon: <CodeRegular />,
            key: t(ResourceKeys.deviceEvents.command.simulate),
            name: t(ResourceKeys.deviceEvents.command.simulate),
            onClick: onToggleSimulationPanel
        };
    };

    const createRefreshCommandItem = () => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
            disabled: state.formMode === 'updating',
            icon: <ArrowSyncRegular />,
            key: REFRESH,
            name: t(ResourceKeys.deviceEvents.command.refresh),
            onClick: getModelDefinition
        };
    };

    const createNavigateBackCommandItem = () => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.close),
            icon: <ArrowLeftRegular />,
            key: NAVIGATE_BACK,
            name: t(ResourceKeys.deviceEvents.command.close),
            onClick: handleClose
        };
    };

    const createContentTypeCommandItem = () => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.customizeContentType),
            disabled: state.formMode !== 'upserted' && state.formMode !== 'initialized'
                        && state.formMode !== 'setDecoderSucceeded' && state.formMode !== 'setDecoderFailed',
            icon: <ArrowUploadRegular />,
            key: UPLOAD,
            name: t(ResourceKeys.deviceEvents.command.customizeContentType),
            onClick: onToggleContentTypePanel
        };
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/events\/.*/, ``);
        navigate(getBackUrl(path, search));
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
        </>
    );
};
