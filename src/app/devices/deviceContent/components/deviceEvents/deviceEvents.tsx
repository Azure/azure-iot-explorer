/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { useLocation } from 'react-router-dom';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { monitorEvents, stopMonitoringEvents } from '../../../../api/services/devicesService';
import { Message } from '../../../../api/models/messages';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX, START, STOP } from '../../../../constants/iconNames';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { MonitorEventsParameters } from '../../../../api/parameters/deviceParameters';
import { Notification, NotificationType } from '../../../../api/models/notification';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { DEFAULT_CONSUMER_GROUP } from '../../../../constants/apiConstants';
import { MILLISECONDS_IN_MINUTE } from '../../../../constants/shared';
import { appConfig, HostMode } from '../../../../../appConfig/appConfig';
import { HeaderView } from '../../../../shared/components/headerView';
import { isValidEventHubConnectionString } from '../../../../shared/utils/hubConnectionStringHelper';
import '../../../../css/_deviceEvents.scss';

const JSON_SPACES = 2;
const LOADING_LOCK = 50;

export interface DeviceEventsDataProps {
    connectionString: string;
}

export interface DeviceEventsActionProps {
    addNotification: (notification: Notification) => void;
}

export interface DeviceEventsState extends ConfigurationSettings{
    events: Message[];
    hasMore: boolean;
    startTime: Date;
    showSystemProperties: boolean;
    synchronizationStatus: SynchronizationStatus;
    monitoringData: boolean;

    loading?: boolean;
    loadingAnnounced?: JSX.Element;
}

export interface ConfigurationSettings {
    consumerGroup: string;
    useBuiltInEventHub: boolean;
    customEventHubName?: string;
    customEventHubConnectionString?: string;
}

export const DeviceEventsComponent: React.FC<DeviceEventsDataProps & DeviceEventsActionProps> = (props: DeviceEventsDataProps & DeviceEventsActionProps) => {
    let timerID: any; // tslint:disable-line:no-any
    let isComponentMounted: boolean;
    const { t } = useLocalizationContext();
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ state, setState ] = React.useState({
        consumerGroup: DEFAULT_CONSUMER_GROUP,
        customEventHubConnectionString: undefined,
        customEventHubName: undefined,
        events: [],
        hasMore: false,
        loading: false,
        loadingAnnounced: undefined,
        monitoringData: false,
        showSystemProperties: false,
        startTime: new Date(new Date().getTime() - MILLISECONDS_IN_MINUTE), // set start time to one minute ago
        synchronizationStatus: SynchronizationStatus.initialized,
        useBuiltInEventHub: true
    });

    React.useEffect(() => {
        isComponentMounted = true;
        return () => {
            stopMonitoring();
            isComponentMounted = false;
        };
    },              []);

    const createCommandBarItems = (): ICommandBarItemProps[] => {
        return [
            createStartMonitoringCommandItem(),
            createClearCommandItem(),
            createSystemPropertiesCommandItem()
        ];
    };

    const createClearCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.clearEvents),
            disabled: state.events.length === 0 || state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {
                iconName: CLEAR
            },
            key: CLEAR,
            name: t(ResourceKeys.deviceEvents.command.clearEvents),
            onClick: onClearData
        };
    };

    const createSystemPropertiesCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.showSystemProperties),
            disabled: state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {
                iconName: state.showSystemProperties ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: CHECKED_CHECKBOX,
            name: t(ResourceKeys.deviceEvents.command.showSystemProperties),
            onClick: onShowSystemProperties
        };
    };

    const createStartMonitoringCommandItem = (): ICommandBarItemProps => {
        if (appConfig.hostMode === HostMode.Electron) {
            const label = state.monitoringData ? t(ResourceKeys.deviceEvents.command.stop) : t(ResourceKeys.deviceEvents.command.start);
            const icon = state.monitoringData ? STOP : START;
            return {
                ariaLabel: label,
                disabled: state.synchronizationStatus === SynchronizationStatus.updating,
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
                disabled: state.synchronizationStatus === SynchronizationStatus.updating || state.monitoringData,
                iconProps: {
                    iconName: START
                },
                key: START,
                name: t(ResourceKeys.deviceEvents.command.fetch),
                onClick: onToggleStart
            };
        }
    };

    const renderConsumerGroup = () => {
        const renderConsumerGroupLabel = (textFieldProps: ITextFieldProps) => (
            <LabelWithTooltip
                className={'consumer-group-label'}
                tooltipText={t(ResourceKeys.deviceEvents.consumerGroups.tooltip)}
            >
                {textFieldProps.label}
            </LabelWithTooltip>
        );

        const consumerGroupChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setState({
                ...state,
                consumerGroup: newValue
            });
        };

        return (
            <TextField
                className={'consumer-group-text-field'}
                onRenderLabel={renderConsumerGroupLabel}
                label={t(ResourceKeys.deviceEvents.consumerGroups.label)}
                ariaLabel={t(ResourceKeys.deviceEvents.consumerGroups.label)}
                underlined={true}
                value={state.consumerGroup}
                disabled={state.monitoringData}
                onChange={consumerGroupChange}
            />
        );
    };

    const renderCustomEventHub = () => {
        const toggleChange = () => {
            setState({
                ...state,
                useBuiltInEventHub: !state.useBuiltInEventHub
            });
        };

        const customEventHubConnectionStringChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setState({
                ...state,
                customEventHubConnectionString: newValue
            });
        };

        const renderError = () => {
            return !isValidEventHubConnectionString(state.customEventHubConnectionString) && t(ResourceKeys.deviceEvents.customEventHub.connectionString.error);
        };

        const customEventHubNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setState({
                ...state,
                customEventHubName: newValue
            });
        };

        return (
            <>
                <Toggle
                    className="toggle-button"
                    checked={state.useBuiltInEventHub}
                    ariaLabel={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                    label={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                    onText={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.on)}
                    offText={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.off)}
                    onChange={toggleChange}
                    disabled={state.monitoringData}
                />
                {!state.useBuiltInEventHub &&
                    <>
                        <TextField
                            className={'custom-event-hub-text-field'}
                            label={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                            ariaLabel={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                            underlined={true}
                            value={state.customEventHubConnectionString}
                            disabled={state.monitoringData}
                            onChange={customEventHubConnectionStringChange}
                            placeholder={t(ResourceKeys.deviceEvents.customEventHub.connectionString.placeHolder)}
                            errorMessage={renderError()}
                            required={true}
                        />
                        <TextField
                            className={'custom-event-hub-text-field'}
                            label={t(ResourceKeys.deviceEvents.customEventHub.name.label)}
                            ariaLabel={t(ResourceKeys.deviceEvents.customEventHub.name.label)}
                            underlined={true}
                            value={state.customEventHubName}
                            disabled={state.monitoringData}
                            onChange={customEventHubNameChange}
                            required={true}
                        />
                    </>
                }
            </>
        );
    };

    const stopMonitoring = async () => {
        clearTimeout(timerID);
        return stopMonitoringEvents();
    };

    const onToggleStart = () => {
        const monitoringState = state.monitoringData;

        if (monitoringState) {
            stopMonitoring().then(() => {
                setState({
                    ...state,
                    monitoringData: false,
                    synchronizationStatus: SynchronizationStatus.fetched
                });
            });
            setState({
                ...state,
                hasMore: false,
                synchronizationStatus: SynchronizationStatus.updating
            });
        } else {
            setState({
                ...state,
                hasMore: true,
                loading: false,
                loadingAnnounced: undefined,
                monitoringData: true
            });
        }
    };

    const renderInfiniteScroll = () => {
        const { hasMore } = state;
        const InfiniteScroll = require('react-infinite-scroller'); // https://github.com/CassetteRocks/react-infinite-scroller/issues/110
        return (
            <InfiniteScroll
                key="scroll"
                className="device-events-container"
                pageStart={0}
                loadMore={fetchData()}
                hasMore={hasMore}
                loader={renderLoader()}
                role={state.events && state.events.length === 0 ? 'main' : 'feed'}
                isReverse={true}
            >
                {renderEvents()}
            </InfiniteScroll>
        );
    };

    const renderEvents = () => {
        const { events } = state;

        return (
            <div className="scrollable-telemetry">
            {
                events && events.map((event: Message, index) => {
                    return (
                        <article key={index} className="device-events-content">
                            {<h5>{parseDateTimeString(event.enqueuedTime)}:</h5>}
                            <pre>{JSON.stringify(event, undefined, JSON_SPACES)}</pre>
                        </article>
                    );
                })
            }
            </div>
        );
    };

    const renderLoader = (): JSX.Element => {
        return (
            <div key="loading" className="events-loader">
                <Spinner/>
                <h4>{t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</h4>
            </div>
        );
    };

    const fetchData = () => () => {
        const { loading, monitoringData } = state;
        if (!loading && monitoringData) {
            setState({
                ...state,
                loading: true,
                loadingAnnounced: <Announced message={t(ResourceKeys.deviceEvents.infiniteScroll.loading)}/>
            });
            timerID = setTimeout(
                () => {
                    let parameters: MonitorEventsParameters = {
                        consumerGroup: state.consumerGroup,
                        deviceId,
                        fetchSystemProperties: state.showSystemProperties,
                        startTime: state.startTime
                    };

                    if (!state.useBuiltInEventHub && state.customEventHubConnectionString && state.customEventHubName) {
                        parameters = {
                            ...parameters,
                            customEventHubConnectionString: state.customEventHubConnectionString,
                            customEventHubName: state.customEventHubName
                        };
                    }
                    else {
                        parameters = {
                            ...parameters,
                            hubConnectionString: props.connectionString,
                        };
                    }

                    monitorEvents(parameters)
                    .then(results => {
                        const messages = results ? results.reverse().map((message: Message) => message) : [];
                        if (isComponentMounted) {
                            setState({
                                ...state,
                                events: [...messages, ...state.events],
                                loading: false,
                                startTime: new Date()
                            });
                            stopMonitoringIfNecessary();
                        }
                    })
                    .catch (error => {
                        props.addNotification({
                            text: {
                                translationKey: ResourceKeys.deviceEvents.error,
                                translationOptions: {
                                    error
                                }
                            },
                            type: NotificationType.error
                        });
                        stopMonitoringIfNecessary();
                    });
                },
                LOADING_LOCK);
        }
    };

    const onClearData = () => {
        setState({
            ...state,
            events: []
        });
    };

    const onShowSystemProperties = () => {
        setState({
            ...state,
            showSystemProperties: !state.showSystemProperties
        });
    };

    const stopMonitoringIfNecessary = () => {
        if (appConfig.hostMode === HostMode.Electron) {
            return;
        }
        else {
            stopMonitoring().then(() => {
                setState({
                    ...state,
                    hasMore: false,
                    monitoringData: false,
                    synchronizationStatus: SynchronizationStatus.fetched
                });
            });
        }
    };

    return (
        <div className="device-events" key="device-events">
            <CommandBar
                className="command"
                items={createCommandBarItems()}
            />
            <HeaderView
                headerText={ResourceKeys.deviceEvents.headerText}
                tooltip={ResourceKeys.deviceEvents.tooltip}
            />
            {renderConsumerGroup()}
            {renderCustomEventHub()}
            {renderInfiniteScroll()}
            {state.loadingAnnounced}
        </div>
    );
};
