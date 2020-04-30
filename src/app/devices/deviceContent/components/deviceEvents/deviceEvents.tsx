/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
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

export default class DeviceEventsComponent extends React.Component<DeviceEventsDataProps & DeviceEventsActionProps & RouteComponentProps, DeviceEventsState> {
    // tslint:disable-next-line:no-any
    private timerID: any;
    private isComponentMounted: boolean;
    constructor(props: DeviceEventsDataProps & DeviceEventsActionProps & RouteComponentProps) {
        super(props);

        this.state = {
            consumerGroup: DEFAULT_CONSUMER_GROUP,
            events: [],
            hasMore: false,
            monitoringData: false,
            showSystemProperties: false,
            startTime: new Date(new Date().getTime() - MILLISECONDS_IN_MINUTE), // set start time to one minute ago
            synchronizationStatus: SynchronizationStatus.initialized,
            useBuiltInEventHub: true
        };
    }

    public componentWillUnmount() {
        this.stopMonitoring();
        this.isComponentMounted = false;
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="device-events" key="device-events">
                        <CommandBar
                            className="command"
                            items={this.createCommandBarItems(context)}
                        />
                        <HeaderView
                            headerText={ResourceKeys.deviceEvents.headerText}
                            tooltip={ResourceKeys.deviceEvents.tooltip}
                        />
                        {this.renderConsumerGroup(context)}
                        {this.renderCustomEventHub(context)}
                        {this.renderInfiniteScroll(context)}
                        {this.state.loadingAnnounced}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private createCommandBarItems = (context: LocalizationContextInterface): ICommandBarItemProps[] => {
        return [
            this.createStartMonitoringCommandItem(context),
            this.createClearCommandItem(context),
            this.createSystemPropertiesCommandItem(context)
        ];
    }

    private createClearCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        return {
            ariaLabel: context.t(ResourceKeys.deviceEvents.command.clearEvents),
            disabled: this.state.events.length === 0 || this.state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {
                iconName: CLEAR
            },
            key: CLEAR,
            name: context.t(ResourceKeys.deviceEvents.command.clearEvents),
            onClick: this.onClearData
        };
    }

    private createSystemPropertiesCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        return {
            ariaLabel: context.t(ResourceKeys.deviceEvents.command.showSystemProperties),
            disabled: this.state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {
                iconName: this.state.showSystemProperties ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: CHECKED_CHECKBOX,
            name: context.t(ResourceKeys.deviceEvents.command.showSystemProperties),
            onClick: this.onShowSystemProperties
        };
    }

    private createStartMonitoringCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        if (appConfig.hostMode === HostMode.Electron) {
            const label = this.state.monitoringData ? context.t(ResourceKeys.deviceEvents.command.stop) : context.t(ResourceKeys.deviceEvents.command.start);
            const icon = this.state.monitoringData ? STOP : START;
            return {
                ariaLabel: label,
                disabled: this.state.synchronizationStatus === SynchronizationStatus.updating,
                iconProps: {
                    iconName: icon
                },
                key: icon,
                name: label,
                onClick: this.onToggleStart
            };
        }
        else {
            return {
                ariaLabel: context.t(ResourceKeys.deviceEvents.command.fetch),
                disabled: this.state.synchronizationStatus === SynchronizationStatus.updating || this.state.monitoringData,
                iconProps: {
                    iconName: START
                },
                key: START,
                name: context.t(ResourceKeys.deviceEvents.command.fetch),
                onClick: this.onToggleStart
            };
        }
    }

    private renderConsumerGroup = (context: LocalizationContextInterface) => {
        const renderConsumerGroupLabel = (props: ITextFieldProps) => (
            <LabelWithTooltip
                className={'consumer-group-label'}
                tooltipText={context.t(ResourceKeys.deviceEvents.consumerGroups.tooltip)}
            >
                {props.label}
            </LabelWithTooltip>
        );

        const consumerGroupChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            this.setState({
                consumerGroup: newValue
            });
        };

        return (
            <TextField
                className={'consumer-group-text-field'}
                onRenderLabel={renderConsumerGroupLabel}
                label={context.t(ResourceKeys.deviceEvents.consumerGroups.label)}
                ariaLabel={context.t(ResourceKeys.deviceEvents.consumerGroups.label)}
                underlined={true}
                value={this.state.consumerGroup}
                disabled={this.state.monitoringData}
                onChange={consumerGroupChange}
            />
        );
    }

    private renderCustomEventHub = (context: LocalizationContextInterface) => {
        const toggleChange = () => {
            this.setState({
                useBuiltInEventHub: !this.state.useBuiltInEventHub
            });
        };

        const customEventHubConnectionStringChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            this.setState({
                customEventHubConnectionString: newValue
            });
        };

        const renderError = () => {
            return !isValidEventHubConnectionString(this.state.customEventHubConnectionString) && context.t(ResourceKeys.deviceEvents.customEventHub.connectionString.error);
        };

        const customEventHubNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            this.setState({
                customEventHubName: newValue
            });
        };

        return (
            <>
                <Toggle
                    className="toggle-button"
                    checked={this.state.useBuiltInEventHub}
                    ariaLabel={context.t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                    label={context.t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                    onText={context.t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.on)}
                    offText={context.t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.off)}
                    onChange={toggleChange}
                    disabled={this.state.monitoringData}
                />
                {!this.state.useBuiltInEventHub &&
                    <>
                        <TextField
                            className={'custom-event-hub-text-field'}
                            label={context.t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                            ariaLabel={context.t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                            underlined={true}
                            value={this.state.customEventHubConnectionString}
                            disabled={this.state.monitoringData}
                            onChange={customEventHubConnectionStringChange}
                            placeholder={context.t(ResourceKeys.deviceEvents.customEventHub.connectionString.placeHolder)}
                            errorMessage={renderError()}
                            required={true}
                        />
                        <TextField
                            className={'custom-event-hub-text-field'}
                            label={context.t(ResourceKeys.deviceEvents.customEventHub.name.label)}
                            ariaLabel={context.t(ResourceKeys.deviceEvents.customEventHub.name.label)}
                            underlined={true}
                            value={this.state.customEventHubName}
                            disabled={this.state.monitoringData}
                            onChange={customEventHubNameChange}
                            required={true}
                        />
                    </>
                }
            </>
        );
    }

    private stopMonitoring = () => {
        clearTimeout(this.timerID);
        return stopMonitoringEvents();
    }

    private onToggleStart = () => {
        const monitoringState = this.state.monitoringData;

        if (monitoringState) {
            this.stopMonitoring().then(() => {
                this.setState({
                    monitoringData: false,
                    synchronizationStatus: SynchronizationStatus.fetched
                });
            });
            this.setState({
                hasMore: false,
                synchronizationStatus: SynchronizationStatus.updating
            });
        } else {
            this.setState({
                hasMore: true,
                loading: false,
                loadingAnnounced: undefined,
                monitoringData: true
            });
        }
    }

    public componentDidMount() {
        this.isComponentMounted = true;
    }

    private readonly renderInfiniteScroll = (context: LocalizationContextInterface) => {
        const { hasMore } = this.state;
        const InfiniteScroll = require('react-infinite-scroller'); // https://github.com/CassetteRocks/react-infinite-scroller/issues/110
        return (
            <InfiniteScroll
                key="scroll"
                className="device-events-container"
                pageStart={0}
                loadMore={this.fetchData(context)}
                hasMore={hasMore}
                loader={this.renderLoader(context)}
                role={this.state.events && this.state.events.length === 0 ? 'main' : 'feed'}
                isReverse={true}
            >
            {this.renderEvents()}
            </InfiniteScroll>
        );
    }

    private readonly renderEvents = () => {
        const { events } = this.state;

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
    }

    private readonly renderLoader = (context: LocalizationContextInterface): JSX.Element => {
        return (
            <div key="loading" className="events-loader">
                <Spinner/>
                <h4>{context.t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</h4>
            </div>
        );
    }

    private readonly fetchData = (context: LocalizationContextInterface) => () => {
        const { loading, monitoringData } = this.state;
        if (!loading && monitoringData) {
            this.setState({
                loading: true,
                loadingAnnounced: <Announced message={context.t(ResourceKeys.deviceEvents.infiniteScroll.loading)}/>
            });
            this.timerID = setTimeout(
                () => {
                    let parameters: MonitorEventsParameters = {
                        consumerGroup: this.state.consumerGroup,
                        deviceId: getDeviceIdFromQueryString(this.props),
                        fetchSystemProperties: this.state.showSystemProperties,
                        startTime: this.state.startTime
                    };

                    if (!this.state.useBuiltInEventHub && this.state.customEventHubConnectionString && this.state.customEventHubName) {
                        parameters = {
                            ...parameters,
                            customEventHubConnectionString: this.state.customEventHubConnectionString,
                            customEventHubName: this.state.customEventHubName
                        };
                    }
                    else {
                        parameters = {
                            ...parameters,
                            hubConnectionString: this.props.connectionString,
                        };
                    }

                    monitorEvents(parameters)
                    .then(results => {
                        const messages = results ? results.reverse().map((message: Message) => message) : [];
                        if (this.isComponentMounted) {
                            this.setState({
                                events: [...messages, ...this.state.events],
                                loading: false,
                                startTime: new Date()
                            });
                            this.stopMonitoringIfNecessary();
                        }
                    })
                    .catch (error => {
                        this.props.addNotification({
                            text: {
                                translationKey: ResourceKeys.deviceEvents.error,
                                translationOptions: {
                                    error
                                }
                            },
                            type: NotificationType.error
                        });
                        this.stopMonitoringIfNecessary();
                    });
                },
                LOADING_LOCK);
        }
    }

    private readonly onClearData = () => {
        this.setState({
            events: []
        });
    }

    private readonly onShowSystemProperties = () => {
        this.setState({
            showSystemProperties: !this.state.showSystemProperties
        });
    }

    private readonly stopMonitoringIfNecessary = () => {
        if (appConfig.hostMode === HostMode.Electron) {
            return;
        }
        else {
            this.stopMonitoring().then(() => {
                this.setState({
                    hasMore: false,
                    monitoringData: false,
                    synchronizationStatus: SynchronizationStatus.fetched
                });
            });
        }
    }
}
