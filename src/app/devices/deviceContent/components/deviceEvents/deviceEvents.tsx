/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { monitorEvents, stopMonitoringEvents } from '../../../../api/services/devicesService';
import { Message } from '../../../../api/models/messages';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX, START, STOP } from '../../../../constants/iconNames';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { DEFAULT_CONSUMER_GROUP } from '../../../../constants/apiConstants';
import '../../../../css/_deviceEvents.scss';

const JSON_SPACES = 2;
const LOADING_LOCK = 50;

export interface DeviceEventsDataProps {
    connectionString: string;
}

interface DeviceEventsState {
    events: Message[];
    hasMore: boolean;
    startTime?: Date; // todo: add a datetime picker
    loading?: boolean;
    showSystemProperties: boolean;
    synchronizationStatus: SynchronizationStatus;
    consumerGroup: string;
    monitoringData: boolean;
}

export default class DeviceEventsComponent extends React.Component<DeviceEventsDataProps & RouteComponentProps, DeviceEventsState> {
    // tslint:disable-next-line:no-any
    private timerID: any;
    private isComponentMounted: boolean;
    constructor(props: DeviceEventsDataProps & RouteComponentProps) {
        super(props);

        this.state = {
            consumerGroup: DEFAULT_CONSUMER_GROUP,
            events: [],
            hasMore: false,
            monitoringData: false,
            showSystemProperties: false,
            synchronizationStatus: SynchronizationStatus.initialized,
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
                        <h3>{context.t(ResourceKeys.deviceEvents.headerText)}</h3>
                        <TextField
                            className={'consumer-group-text-field'}
                            onRenderLabel={this.renderConsumerGroupLabel}
                            label={context.t(ResourceKeys.deviceEvents.consumerGroups.label)}
                            underlined={true}
                            value={this.state.consumerGroup}
                            disabled={this.state.monitoringData}
                            onChange={this.consumerGroupChange}
                        />
                        {this.renderInfiniteScroll(context)}
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
        return {
            ariaLabel: this.state.monitoringData ? context.t(ResourceKeys.deviceEvents.command.stop) : context.t(ResourceKeys.deviceEvents.command.start),
            disabled: this.state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {
                iconName: this.state.monitoringData ? STOP : START
            },
            key: this.state.monitoringData ? STOP : START,
            name: this.state.monitoringData ? context.t(ResourceKeys.deviceEvents.command.stop) : context.t(ResourceKeys.deviceEvents.command.start),
            onClick: this.onToggleStart
        };
    }

    private consumerGroupChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!!newValue) {
            this.setState({
                consumerGroup: newValue
            });
        }
    }

    private renderConsumerGroupLabel = (props: ITextFieldProps) => {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <LabelWithTooltip
                        className={'consumer-group-label'}
                        tooltipText={context.t(ResourceKeys.deviceEvents.consumerGroups.tooltip)}
                    >
                        {props.label}
                    </LabelWithTooltip>
                )}
            </LocalizationContextConsumer>
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
                monitoringData: true
            });
        }
    }

    public componentDidMount() {
        this.isComponentMounted = true;
    }

    private readonly renderInfiniteScroll = (context: LocalizationContextInterface) => {
        const { hasMore } = this.state;
        return (
            <InfiniteScroll
                key="scroll"
                className="device-events-container scrollable"
                pageStart={0}
                loadMore={this.fetchData}
                hasMore={hasMore}
                loader={this.renderLoader(context)}
                role="feed"
                isReverse={true}
            >
            {this.renderEvents()}
            </InfiniteScroll>
        );
    }

    private readonly renderEvents = () => {
        const { events } = this.state;

        return events && events.map((event: Message, index) => {
            return (
                <article key={index} className="device-events-content">
                    {<h5>{parseDateTimeString(event.enqueuedTime)}:</h5>}
                    <pre>{JSON.stringify(event, undefined, JSON_SPACES)}</pre>
                </article>
            );
        });
    }

    private readonly renderLoader = (context: LocalizationContextInterface): JSX.Element => {
        return (
            <div key="loading" className="events-loader">
                <Spinner/>
                <h4>{context.t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</h4>
            </div>
        );
    }

    private readonly fetchData = () => {
        const { loading, monitoringData } = this.state;
        if (!loading && monitoringData) {
            this.setState({
                loading: true,
            });
            this.timerID = setTimeout(
                () => {
                    monitorEvents({
                        consumerGroup: this.state.consumerGroup,
                        deviceId: getDeviceIdFromQueryString(this.props),
                        fetchSystemProperties: this.state.showSystemProperties,
                        hubConnectionString: this.props.connectionString,
                        startTime: this.state.startTime
                    })
                    .then(results => {
                        const messages = results && results.reverse().map((message: Message) => message);
                        if (this.isComponentMounted) {
                            this.setState({
                                events: [...messages, ...this.state.events],
                                loading: false,
                                startTime: new Date()
                            });
                        }
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
}
