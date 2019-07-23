/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { monitorEvents } from '../../../../api/services/devicesService';
import { Message } from '../../../../api/models/messages';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX } from '../../../../constants/iconNames';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
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
}

export default class DeviceEventsComponent extends React.Component<DeviceEventsDataProps & RouteComponentProps, DeviceEventsState> {
    // tslint:disable-next-line:no-any
    private timerID: any;
    private isComponentMounted: boolean;
    constructor(props: DeviceEventsDataProps & RouteComponentProps) {
        super(props);

        this.state = {
            events: [],
            hasMore: true,
            showSystemProperties: false
        };
    }

    public componentWillUnmount() {
        clearInterval(this.timerID);
        this.isComponentMounted = false;
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="device-events" key="device-events">
                        <CommandBar
                            className="command"
                            items={[
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceEvents.command.clearEvents),
                                    disabled: this.state.events.length === 0,
                                    iconProps: {
                                        iconName: CLEAR
                                    },
                                    key: CLEAR,
                                    name: context.t(ResourceKeys.deviceEvents.command.clearEvents),
                                    onClick: this.onClearData
                                },
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceEvents.command.showSystemProperties),
                                    iconProps: {
                                        iconName: this.state.showSystemProperties ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
                                    },
                                    key: CHECKED_CHECKBOX,
                                    name: context.t(ResourceKeys.deviceEvents.command.showSystemProperties),
                                    onClick: this.onShowSystemProperties
                                }
                            ]}
                        />
                        <h3>{context.t(ResourceKeys.deviceEvents.headerText)}</h3>
                        {this.renderInfiniteScroll(context)}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
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
        const { loading } = this.state;
        if (!loading) {
            this.setState({
                loading: true,
            });
            this.timerID = setTimeout(
                () => {
                    monitorEvents({
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
