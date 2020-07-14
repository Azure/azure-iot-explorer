/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { useLocation } from 'react-router-dom';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/components/TextField';
import { Announced } from 'office-ui-fabric-react/lib/components/Announced';
import { Toggle } from 'office-ui-fabric-react/lib/components/Toggle';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { monitorEvents, stopMonitoringEvents } from '../../../api/services/devicesService';
import { Message } from '../../../api/models/messages';
import { parseDateTimeString } from '../../../api/dataTransforms/transformHelper';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX, START, STOP } from '../../../constants/iconNames';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { MonitorEventsParameters } from '../../../api/parameters/deviceParameters';
import { NotificationType } from '../../../api/models/notification';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { DEFAULT_CONSUMER_GROUP } from '../../../constants/apiConstants';
import { MILLISECONDS_IN_MINUTE } from '../../../constants/shared';
import { appConfig, HostMode } from '../../../../appConfig/appConfig';
import { HeaderView } from '../../../shared/components/headerView';
import { isValidEventHubConnectionString } from '../../../shared/utils/hubConnectionStringHelper';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import '../../../css/_deviceEvents.scss';

const JSON_SPACES = 2;
const LOADING_LOCK = 50;

export interface ConfigurationSettings {
    consumerGroup: string;
    useBuiltInEventHub: boolean;
    customEventHubName?: string;
    customEventHubConnectionString?: string;
}

export const DeviceEvents: React.FC = () => {
    let timerID: any; // tslint:disable-line:no-any
    const { t } = useTranslation();
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ consumerGroup, setConsumerGroup] = React.useState(DEFAULT_CONSUMER_GROUP);
    const [ customEventHubConnectionString, setCustomEventHubConnectionString] = React.useState(undefined);
    const [ customEventHubName, setCustomEventHubName] = React.useState(undefined);
    const [ events, SetEvents] = React.useState([]);
    const [ startTime, SetStartTime] = React.useState(new Date(new Date().getTime() - MILLISECONDS_IN_MINUTE));
    const [ useBuiltInEventHub, setUseBuiltInEventHub] = React.useState(true);
    const [ hasMore, setHasMore ] = React.useState(false);
    const [ loading, setLoading ] = React.useState(false);
    const [ loadingAnnounced, setLoadingAnnounced ] = React.useState(undefined);
    const [ monitoringData, setMonitoringData ] = React.useState(false);
    const [ synchronizationStatus, setSynchronizationStatus ] = React.useState(SynchronizationStatus.initialized);
    const [ showSystemProperties, setShowSystemProperties ] = React.useState(false);
    React.useEffect(() => {
        return () => {
            stopMonitoring();
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
            disabled: events.length === 0 || synchronizationStatus === SynchronizationStatus.updating,
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
            disabled: synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {
                iconName: showSystemProperties ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: CHECKED_CHECKBOX,
            name: t(ResourceKeys.deviceEvents.command.showSystemProperties),
            onClick: onShowSystemProperties
        };
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const createStartMonitoringCommandItem = (): ICommandBarItemProps => {
        if (appConfig.hostMode === HostMode.Electron) {
            const label = monitoringData ? t(ResourceKeys.deviceEvents.command.stop) : t(ResourceKeys.deviceEvents.command.start);
            const icon = monitoringData ? STOP : START;
            return {
                ariaLabel: label,
                disabled: synchronizationStatus === SynchronizationStatus.updating ||
                    // when using custom event hub, both connection string and name need to be provided
                    (!useBuiltInEventHub && (!customEventHubConnectionString || !customEventHubName)),
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
            setConsumerGroup(newValue);
        };

        return (
            <TextField
                className={'consumer-group-text-field'}
                onRenderLabel={renderConsumerGroupLabel}
                label={t(ResourceKeys.deviceEvents.consumerGroups.label)}
                ariaLabel={t(ResourceKeys.deviceEvents.consumerGroups.label)}
                underlined={true}
                value={consumerGroup}
                disabled={monitoringData}
                onChange={consumerGroupChange}
            />
        );
    };

    const renderCustomEventHub = () => {
        const toggleChange = () => {
            setUseBuiltInEventHub(!useBuiltInEventHub);
        };

        const customEventHubConnectionStringChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setCustomEventHubConnectionString(newValue);
        };

        const renderError = () => {
            return !isValidEventHubConnectionString(customEventHubConnectionString) && t(ResourceKeys.deviceEvents.customEventHub.connectionString.error);
        };

        const customEventHubNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setCustomEventHubName(newValue);
        };

        return (
            <>
                <Toggle
                    className="toggle-button"
                    checked={useBuiltInEventHub}
                    ariaLabel={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                    label={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                    onText={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.on)}
                    offText={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.off)}
                    onChange={toggleChange}
                    disabled={monitoringData}
                />
                {!useBuiltInEventHub &&
                    <>
                        <TextField
                            className={'custom-event-hub-text-field'}
                            label={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                            ariaLabel={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                            underlined={true}
                            value={customEventHubConnectionString}
                            disabled={monitoringData}
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
                            value={customEventHubName}
                            disabled={monitoringData}
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
        if (monitoringData) {
            stopMonitoring().then(() => {
                setHasMore(false);
                setMonitoringData(false);
                setSynchronizationStatus(SynchronizationStatus.fetched);
            });
            setHasMore(false);
            setSynchronizationStatus(SynchronizationStatus.updating);
        } else {
            setHasMore(true);
            setLoading(false);
            setLoadingAnnounced(undefined);
            setMonitoringData(true);
        }
    };

    const renderInfiniteScroll = () => {
        const InfiniteScroll = require('react-infinite-scroller'); // https://github.com/CassetteRocks/react-infinite-scroller/issues/110
        return (
            <InfiniteScroll
                key="scroll"
                className="device-events-container"
                pageStart={0}
                loadMore={fetchData}
                hasMore={hasMore}
                loader={renderLoader()}
                role={events && events.length === 0 ? 'main' : 'feed'}
                isReverse={true}
            >
                {renderEvents()}
            </InfiniteScroll>
        );
    };

    const renderEvents = () => {
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

    const fetchData = () => {
        if (!loading && monitoringData) {
            setLoading(true);
            setLoadingAnnounced(<Announced message={t(ResourceKeys.deviceEvents.infiniteScroll.loading)}/>);
            timerID = setTimeout(
                () => {
                    let parameters: MonitorEventsParameters = {
                        consumerGroup,
                        deviceId,
                        fetchSystemProperties: showSystemProperties,
                        startTime
                    };

                    if (!useBuiltInEventHub && customEventHubConnectionString && customEventHubName) {
                        parameters = {
                            ...parameters,
                            customEventHubConnectionString,
                            customEventHubName
                        };
                    }

                    monitorEvents(parameters)
                    .then(results => {
                        const messages = results ? results.reverse().map((message: Message) => message) : [];
                        SetEvents([...messages, ...events]);
                        SetStartTime(new Date());
                        setLoading(false);
                        stopMonitoringIfNecessary();
                    })
                    .catch (error => {
                        raiseNotificationToast({
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
        SetEvents([]);
    };

    const onShowSystemProperties = () => {
        setShowSystemProperties(!showSystemProperties);
    };

    const stopMonitoringIfNecessary = () => {
        if (appConfig.hostMode === HostMode.Electron) {
            return;
        }
        else {
            stopMonitoring().then(() => {
                setHasMore(false);
                setMonitoringData(false);
                setSynchronizationStatus(SynchronizationStatus.fetched);
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
            {loadingAnnounced}
        </div>
    );
};
