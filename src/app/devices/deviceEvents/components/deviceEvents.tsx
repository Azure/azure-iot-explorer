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
import { DEFAULT_CONSUMER_GROUP, WEBSOCKET_ENDPOINT } from '../../../constants/apiConstants';
import { HeaderView } from '../../../shared/components/headerView';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { DeviceSimulationPanel } from './deviceSimulationPanel';
import { Commands } from './commands';
import { CustomEventHub } from './customEventHub';
import { ConsumerGroup } from './consumerGroup';
import { StartTime } from './startTime';
import { DeviceContentTypePanel } from './deviceContentTypePanel';
import { Loader } from './loader';
import { EventsContent } from './eventsContent';
import './deviceEvents.scss';

let client: WebSocket;
export const DeviceEvents: React.FC = () => {
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const [ state, api ] = useDeviceEventsStateContext();
    const decoderPrototype = state.contentType.decoderPrototype;

    // event hub settings
    const [consumerGroup, setConsumerGroup] = React.useState(DEFAULT_CONSUMER_GROUP);
    const [specifyStartTime, setSpecifyStartTime] = React.useState<boolean>(false);
    const [startTime, setStartTime] = React.useState<Date>();
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

    React.useEffect(
        () => {
            return () => {
                stopMonitoring();
                client?.close();
            };
        },
        []);

    React.useEffect(
        () => {
            client = new WebSocket(WEBSOCKET_ENDPOINT);
        },
        []);

    React.useEffect(
        () => {
            if (monitoringData) {
                client.onmessage = message => {
                    api.setEvents(JSON.parse(message.data));
                };
            }
        },
        [monitoringData]);

    React.useEffect(    // tslint:disable-next-line: cyclomatic-complexity
        () => {
            if (state.formMode === 'updating' ||
                // when specifying start time, valid time need to be provided
                (specifyStartTime && (!startTime || hasError)) ||
                // when using custom event hub, both valid connection string and name need to be provided
                (!useBuiltInEventHub && (!customEventHubConnectionString || hasError))) {
                setStartDisabled(true);
            }
            else {
                setStartDisabled(false);
            }
        },
        [hasError, state.formMode, useBuiltInEventHub, customEventHubConnectionString, specifyStartTime, startTime]);

    const renderCommands = () => {
        return (
            <Commands
                startDisabled={startDisabled}
                monitoringData={monitoringData}
                showSystemProperties={showSystemProperties}
                showPnpModeledEvents={showPnpModeledEvents}
                showSimulationPanel={showSimulationPanel}
                showContentTypePanel={showContentTypePanel}
                setMonitoringData={setMonitoringData}
                setShowSystemProperties={setShowSystemProperties}
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

    const renderStartTimePicker = () => {
        return (
            <StartTime
                monitoringData={monitoringData}
                specifyStartTime={specifyStartTime}
                startTime={startTime}
                setSpecifyStartTime={setSpecifyStartTime}
                setStartTime={setStartTime}
                setHasError={setHasError}
            />
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
        client.onopen = () => { // intentionally blank
        };
        let parameters: MonitorEventsParameters = {
            consumerGroup,
            decoderPrototype,
            deviceId,
            moduleId,
            startTime
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
            {renderStartTimePicker()}
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
                <Loader monitoringData={monitoringData}/>
                <EventsContent showPnpModeledEvents={showPnpModeledEvents} showSystemProperties={showSystemProperties}/>
            </div>
        </Stack>
    );
};
