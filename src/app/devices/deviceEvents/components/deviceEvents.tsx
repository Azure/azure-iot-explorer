/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Stack } from '@fluentui/react';
import { useLocation } from 'react-router-dom';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { MonitorEventsParameters } from '../../../api/parameters/deviceParameters';
import { subscribeToEventHubMessages } from '../../../api/handlers/eventHubServiceHandler';
import { DEFAULT_CONSUMER_GROUP } from '../../../constants/apiConstants';
import { HeaderView } from '../../../shared/components/headerView';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';
import { usePnpStateContext } from '../../pnp/context/pnpStateContext';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { DeviceSimulationPanel } from './deviceSimulationPanel';
import { Commands } from './commands';
import { CustomEventHub } from './customEventHub';
import { ConsumerGroup } from './consumerGroup';
import { DeviceContentTypePanel } from './deviceContentTypePanel';
import { Loader } from './loader';
import { EventsContent } from './eventsContent';
import { SystemPropertyCheckBox } from './systemPropertyCheckBox';
import './deviceEvents.scss';

export const DeviceEvents: React.FC = () => {
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const [ state, api ] = useDeviceEventsStateContext();
    const decoderPrototype = state.contentType.decoderPrototype;

    // event hub settings
    const [consumerGroup, setConsumerGroup] = React.useState(DEFAULT_CONSUMER_GROUP);
    const [useBuiltInEventHub, setUseBuiltInEventHub] = React.useState<boolean>(true);
    const [customEventHubConnectionString, setCustomEventHubConnectionString] = React.useState<string>(undefined);
    const [showSystemProperties, setShowSystemProperties] = React.useState<boolean>(false);

    // event message state
    const [monitoringData, setMonitoringData] = React.useState<boolean>(false);
    const [startDisabled, setStartDisabled] = React.useState<boolean>(false);
    const [hasError, setHasError] = React.useState<boolean>(false);

    // pnp events specific
    const { pnpState, } = usePnpStateContext();
    const isLoading = pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;
    const [showPnpModeledEvents, setShowPnpModeledEvents] = React.useState(false);

    // simulation specific
    const [showSimulationPanel, setShowSimulationPanel] = React.useState(false);

    // message content type specific
    const [showContentTypePanel, setShowContentTypePanel] = React.useState(false);

    // IPC message subscription
    const unsubscribeRef = React.useRef<(() => void) | null>(null);

    React.useEffect(
        () => {
            return () => {
                stopMonitoring();
                // Unsubscribe from IPC messages on cleanup
                if (unsubscribeRef.current) {
                    unsubscribeRef.current();
                    unsubscribeRef.current = null;
                }
            };
        },
        []);

    React.useEffect(
        () => {
            if (monitoringData) {
                // Subscribe to EventHub messages via IPC
                unsubscribeRef.current = subscribeToEventHubMessages((messages) => {
                    api.setEvents(messages);
                });
            } else {
                // Unsubscribe when not monitoring
                if (unsubscribeRef.current) {
                    unsubscribeRef.current();
                    unsubscribeRef.current = null;
                }
            }
        },
        [monitoringData]);

    React.useEffect(    // tslint:disable-next-line: cyclomatic-complexity
        () => {
            if (state.formMode === 'updating' ||
                // when using custom event hub, both valid connection string and name need to be provided
                (!useBuiltInEventHub && (!customEventHubConnectionString || hasError))) {
                setStartDisabled(true);
            }
            else {
                setStartDisabled(false);
            }
        },
        [hasError, state.formMode, useBuiltInEventHub, customEventHubConnectionString]);

    const onSystemPropertyCheckBoxChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setShowSystemProperties(!!checked);
    };

    const renderCommands = () => {
        return (
            <Commands
                startDisabled={startDisabled}
                monitoringData={monitoringData}
                showPnpModeledEvents={showPnpModeledEvents}
                showSimulationPanel={showSimulationPanel}
                showContentTypePanel={showContentTypePanel}
                setMonitoringData={setMonitoringData}
                setShowPnpModeledEvents={setShowPnpModeledEvents}
                setShowSimulationPanel={setShowSimulationPanel}
                setShowContentTypePanel={setShowContentTypePanel}
                fetchData={fetchData}
                stopFetching={stopMonitoring}
            />
        );
    };

    const renderConsumerGroup = () => {
        return (
            <div className="horizontal-item">
                <ConsumerGroup
                    monitoringData={monitoringData}
                    consumerGroup={consumerGroup}
                    setConsumerGroup={setConsumerGroup}
                />
            </div>
        );
    };

    const renderCustomEventHub = () => {
        return (
            <div className="horizontal-item">
                <CustomEventHub
                    monitoringData={monitoringData}
                    useBuiltInEventHub={useBuiltInEventHub}
                    customEventHubConnectionString={customEventHubConnectionString}
                    setUseBuiltInEventHub={setUseBuiltInEventHub}
                    setCustomEventHubConnectionString={setCustomEventHubConnectionString}
                    setHasError={setHasError}
                />
            </div>
        );
    };

    const stopMonitoring = () => {
        api.stopEventsMonitoring();
    };

    const fetchData = () => {
        let parameters: MonitorEventsParameters = {
            consumerGroup,
            decoderPrototype,
            deviceId,
            moduleId
        };

        if (!useBuiltInEventHub) {
            parameters = {
                ...parameters,
                customEventHubConnectionString
            };
        }
        api.startEventsMonitoring(parameters);
    };

    const onToggleSimulationPanel = () => {
        setShowSimulationPanel(!showSimulationPanel);
    };

    const onToggleContentTypePanel = () => {
        setShowContentTypePanel(!showContentTypePanel);
    };

    if (isLoading) {
        return <MultiLineShimmer />;
    }

    return (
        <Stack className="device-events" key="device-events">
            {renderCommands()}
            <HeaderView
                headerText={ResourceKeys.deviceEvents.headerText}
                tooltip={ResourceKeys.deviceEvents.tooltip}
            />
            {renderConsumerGroup()}
            {renderCustomEventHub()}
            <DeviceSimulationPanel
                showSimulationPanel={showSimulationPanel}
                onToggleSimulationPanel={onToggleSimulationPanel}
            />
            <DeviceContentTypePanel
                showContentTypePanel={showContentTypePanel}
                onToggleContentTypePanel={onToggleContentTypePanel}
            />
            <div className="device-events-container">
                <SystemPropertyCheckBox
                     showSystemProperties={showSystemProperties}
                     showPnpModeledEvents={showPnpModeledEvents}
                     setShowSystemProperties={onSystemPropertyCheckBoxChange}
                />
                <Loader monitoringData={monitoringData}/>
                <EventsContent showPnpModeledEvents={showPnpModeledEvents} showSystemProperties={showSystemProperties}/>
            </div>
        </Stack>
    );
};
