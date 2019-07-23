/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Validator } from 'jsonschema';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { monitorEvents } from '../../../../api/services/devicesService';
import { Message, MESSAGE_SYSTEM_PROPERTIES, MESSAGE_PROPERTIES } from '../../../../api/models/messages';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { CLEAR, REFRESH } from '../../../../constants/iconNames';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { TelemetryContent } from '../../../../api/models/modelDefinition';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import '../../../../css/_deviceEvents.scss';

const JSON_SPACES = 2;
const LOADING_LOCK = 50;
const TELEMETRY_SCHEMA_PROP = MESSAGE_PROPERTIES.IOTHUB_MESSAGE_SCHEMA;
const TELEMETRY_INTERFACE_ID_PROP = MESSAGE_SYSTEM_PROPERTIES.IOTHUB_INTERFACE_ID;

export interface DeviceEventsDataProps {
    connectionString: string;
    isLoading: boolean;
    telemetrySchema: TelemetrySchema[];
}

export interface DeviceEventsDispatchProps {
    setInterfaceId: (id: string) => void;
    refresh: (deviceId: string, interfaceId: string) => void;
}

export interface TelemetrySchema {
    parsedSchema: ParsedJsonSchema;
    telemetryModelDefinition: TelemetryContent;
}

interface DeviceEventsState {
    events: Message[];
    hasMore: boolean;
    startTime?: Date; // todo: add a datetime picker
    loading?: boolean;
}

export default class DeviceEventsPerInterfaceComponent extends React.Component<DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps, DeviceEventsState> {
    // tslint:disable-next-line:no-any
    private timerID: any;
    constructor(props: DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            events: [],
            hasMore: true
        };
    }

    public componentWillUnmount() {
        clearInterval(this.timerID);
      }

    public render(): JSX.Element {
        if (this.props.isLoading) {
            return (
                <Shimmer/>
            );
        }

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="device-events" key="device-events">
                        { this.props.telemetrySchema && <CommandBar
                            className="command"
                            items={[
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceEvents.command.refresh),
                                    iconProps: {iconName: REFRESH},
                                    key: REFRESH,
                                    name: context.t(ResourceKeys.deviceEvents.command.refresh),
                                    onClick: this.handleRefresh
                                },
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceEvents.command.clearEvents),
                                    disabled: this.state.events.length === 0,
                                    iconProps: {iconName: CLEAR},
                                    key: CLEAR,
                                    name: context.t(ResourceKeys.deviceEvents.command.clearEvents),
                                    onClick: this.onClearData
                                }
                            ]}
                        />}
                        <h3>{context.t(ResourceKeys.deviceEvents.headerText)}</h3>
                        {this.props.telemetrySchema  ?
                            this.props.telemetrySchema.length !== 0 && this.renderInfiniteScroll(context) :
                            <InterfaceNotFoundMessageBoxContainer/>}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.setInterfaceId(getInterfaceIdFromQueryString(this.props));
    }

    private readonly renderInfiniteScroll = (context: LocalizationContextInterface) => {
        const { hasMore } = this.state;
        return (
            <InfiniteScroll
                key="scroll"
                className="device-events-container"
                pageStart={0}
                loadMore={this.fetchData}
                hasMore={hasMore}
                loader={this.renderLoader(context)}
                role="feed"
                isReverse={true}
            >
            <section role="list" className="list-content scrollable-sm">
                {this.renderEvents(context)}
            </section>
            </InfiniteScroll>
        );
    }

    private readonly renderEvents = (context: LocalizationContextInterface) => {
        const { events } = this.state;

        return events && events.map((event: Message, index) => {
            const matchingSchema = this.props.telemetrySchema.filter(schema => schema.telemetryModelDefinition.name ===
                event.properties[TELEMETRY_SCHEMA_PROP]);
            const telemetryModelDefinition =  matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].telemetryModelDefinition;
            const parsedSchema = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].parsedSchema;

            return (
                <article className="list-item" role="listitem" key={index}>
                    <section className="item-oneline">
                        {this.renderTimestamp(event, context)}
                        {this.renderEventName(telemetryModelDefinition, context)}
                        {this.renderEventSchema(telemetryModelDefinition, context)}
                        {this.renderEventUnit(telemetryModelDefinition, context)}
                        {this.renderMessageBody(event, context, event.properties[TELEMETRY_SCHEMA_PROP], parsedSchema)}
                    </section>
                </article>
            );
        });
    }

    private readonly renderTimestamp = (event: Message, context: LocalizationContextInterface) => {
        return(
            <Label className="column-timestamp-xs" aria-label={context.t(ResourceKeys.deviceEvents.columns.timestamp)}>
                {parseDateTimeString(event.enqueuedTime)}
            </Label>
        );
    }

    private readonly renderEventName = (telemetryModelDefinition: TelemetryContent, context: LocalizationContextInterface) => {
        return(
            <Label className="column-name-xs" aria-label={context.t(ResourceKeys.deviceEvents.columns.displayName)}>
                {telemetryModelDefinition ?
                    `${telemetryModelDefinition.name} (${telemetryModelDefinition.displayName ? telemetryModelDefinition.displayName : '--'}) ` : '--'}
            </Label>
        );
    }

    private readonly renderEventSchema = (telemetryModelDefinition: TelemetryContent, context: LocalizationContextInterface) => {
        return(
            <Label className="column-schema" aria-label={context.t(ResourceKeys.deviceEvents.columns.schema)}>
                {telemetryModelDefinition ?
                    (typeof telemetryModelDefinition.schema === 'string' ?
                    telemetryModelDefinition.schema :
                    telemetryModelDefinition.schema['@type']) : '--'}
            </Label>
        );
    }

    private readonly renderEventUnit = (telemetryModelDefinition: TelemetryContent, context: LocalizationContextInterface) => {
        return(
            <Label className="column-unit" aria-label={context.t(ResourceKeys.deviceEvents.columns.unit)}>
                {telemetryModelDefinition ?
                    telemetryModelDefinition.unit || telemetryModelDefinition.displayUnit : '--'}
            </Label>
        );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly renderMessageBody = (event: Message, context: LocalizationContextInterface, key: string, schema: ParsedJsonSchema) => {
        if (!key) {
            return;
        }

        const validator = new Validator();
        if (Object.keys(event.body) && Object.keys(event.body)[0] !== key) {
            return(
                <div className="column-value-text">
                    <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                        {JSON.stringify(event.body, undefined, JSON_SPACES)}
                        <section className="value-validation-error" aria-label={context.t(ResourceKeys.deviceEvents.columns.error.key.label)}>
                            <span>{context.t(ResourceKeys.deviceEvents.columns.error.key.label)}</span>
                            <li key={key}>{context.t(ResourceKeys.deviceEvents.columns.error.key.errorContent, {keyName: key})}</li>
                        </section>
                    </Label>
                </div>
            );
        }

        const result = validator.validate(event.body[key], schema);
        return(
            <div className="column-value-text">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(event.body, undefined, JSON_SPACES)}
                    {result && result.errors && result.errors.length !== 0 &&
                        <section className="value-validation-error" aria-label={context.t(ResourceKeys.deviceEvents.columns.error.value.label)}>
                        <span>{context.t(ResourceKeys.deviceEvents.columns.error.value.label)}</span>
                        {result.errors.map((element, index) =>
                            <li key={index}>{element.message}</li>
                        )}
                    </section>
                    }
                </Label>
            </div>
        );
    }

    private readonly renderLoader = (context: LocalizationContextInterface): JSX.Element => {
        return (
            <>
            <div key="loading" className="events-loader">
                <Spinner/>
                <h4>{context.t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</h4>
            </div>
            <div className="pnp-detail-list">
                <div className="list-header">
                    <span className="column-timestamp-xs">{context.t(ResourceKeys.deviceEvents.columns.timestamp)}</span>
                    <span className="column-name-xs">{context.t(ResourceKeys.deviceEvents.columns.displayName)}</span>
                    <span className="column-schema-sm">{context.t(ResourceKeys.deviceEvents.columns.schema)}</span>
                    <span className="column-unit-sm">{context.t(ResourceKeys.deviceEvents.columns.unit)}</span>
                    <span className="column-value-sm">{context.t(ResourceKeys.deviceEvents.columns.value)}</span>
                </div>
            </div>
            </>
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
                        fetchSystemProperties: true,
                        hubConnectionString: this.props.connectionString,
                        startTime: this.state.startTime})
                    .then((results: Message[]) => {
                        const messages = results && results
                                .filter(result => result && result.systemProperties &&
                                        result.systemProperties[TELEMETRY_INTERFACE_ID_PROP] === getInterfaceIdFromQueryString(this.props))
                                .reverse().map((message: Message) => message);
                        this.setState({
                            events: [...messages, ...this.state.events],
                            loading: false,
                            startTime: new Date()});
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

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }
}
