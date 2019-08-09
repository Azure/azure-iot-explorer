/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Validator, ValidatorResult } from 'jsonschema';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { monitorEvents, stopMonitoringEvents } from '../../../../api/services/devicesService';
import { Message, MESSAGE_SYSTEM_PROPERTIES, MESSAGE_PROPERTIES } from '../../../../api/models/messages';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { CLEAR, REFRESH, STOP, START } from '../../../../constants/iconNames';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { TelemetryContent } from '../../../../api/models/modelDefinition';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { getNumberOfMapsInSchema } from '../../../../shared/utils/twinAndJsonSchemaDataConverter';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import '../../../../css/_deviceEvents.scss';
import { DEFAULT_CONSUMER_GROUP } from '../../../../constants/apiConstants';

const JSON_SPACES = 2;
const LOADING_LOCK = 50;
const TELEMETRY_SCHEMA_PROP = MESSAGE_PROPERTIES.IOTHUB_MESSAGE_SCHEMA;
const TELEMETRY_INTERFACE_NAME_PROP = MESSAGE_SYSTEM_PROPERTIES.IOTHUB_INTERFACE_NAME;

export interface DeviceEventsDataProps {
    connectionString: string;
    isLoading: boolean;
    telemetrySchema: TelemetrySchema[];
    interfaceName: string;
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
    consumerGroup: string;
    events: Message[];
    hasMore: boolean;
    startTime?: Date; // todo: add a datetime picker
    loading?: boolean;
    synchronizationStatus: SynchronizationStatus;
    monitoringData: boolean;
}

export default class DeviceEventsPerInterfaceComponent extends React.Component<DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps, DeviceEventsState> {
    // tslint:disable-next-line:no-any
    private timerID: any;
    private isComponentMounted: boolean;
    constructor(props: DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps) {
        super(props);
        this.state = {
            consumerGroup: DEFAULT_CONSUMER_GROUP,
            events: [],
            hasMore: false,
            monitoringData: false,
            synchronizationStatus: SynchronizationStatus.initialized
        };
    }

    public componentWillUnmount() {
        this.stopMonitoring();
        this.isComponentMounted = false;
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
                            items={this.createCommandBarItems(context)}
                        />}
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
                        {this.props.telemetrySchema  ?
                            this.props.telemetrySchema.length !== 0 && this.renderInfiniteScroll(context) :
                            <InterfaceNotFoundMessageBoxContainer/>}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private createCommandBarItems = (context: LocalizationContextInterface): ICommandBarItemProps[] => {
        return [
            this.createStartMonitoringCommandItem(context),
            this.createRefreshCommandItem(context),
            this.createClearCommandItem(context)
        ];
    }

    private createClearCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        return {
            ariaLabel: context.t(ResourceKeys.deviceEvents.command.clearEvents),
            disabled: this.state.events.length === 0 || this.state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {iconName: CLEAR},
            key: CLEAR,
            name: context.t(ResourceKeys.deviceEvents.command.clearEvents),
            onClick: this.onClearData
        };
    }

    private createRefreshCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        return {
            ariaLabel: context.t(ResourceKeys.deviceEvents.command.refresh),
            disabled: this.state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {iconName: REFRESH},
            key: REFRESH,
            name: context.t(ResourceKeys.deviceEvents.command.refresh),
            onClick: this.handleRefresh
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
        this.props.setInterfaceId(getInterfaceIdFromQueryString(this.props));
        this.isComponentMounted = true;
    }

    public componentWillReceiveProps(newProps: DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps) {
        const newInterfaceId = getInterfaceIdFromQueryString(newProps);
        if (newInterfaceId !== getInterfaceIdFromQueryString(this.props)) {
            this.setState({events: []});
        }
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
            <section role="list" className="list-content">
                {this.renderEvents(context)}
            </section>
            </InfiniteScroll>
        );
    }

    private readonly renderEvents = (context: LocalizationContextInterface) => {
        const { events } = this.state;

        return (
            <div>
                <div className="pnp-detail-list">
                    <div className="list-header">
                        <span className="column-timestamp-sm">{context.t(ResourceKeys.deviceEvents.columns.timestamp)}</span>
                        <span className="column-name-sm">{context.t(ResourceKeys.deviceEvents.columns.displayName)}</span>
                        <span className="column-schema-sm">{context.t(ResourceKeys.deviceEvents.columns.schema)}</span>
                        <span className="column-unit">{context.t(ResourceKeys.deviceEvents.columns.unit)}</span>
                        <span className="column-value">{context.t(ResourceKeys.deviceEvents.columns.value)}</span>
                    </div>
                </div>
                <div className="scrollable-sm">
                {
                    events && events.map((event: Message, index) => {
                        const matchingSchema = this.props.telemetrySchema.filter(schema => schema.telemetryModelDefinition.name ===
                            event.properties[TELEMETRY_SCHEMA_PROP]);
                        const telemetryModelDefinition =  matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].telemetryModelDefinition;
                        const parsedSchema = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].parsedSchema;

                        return (
                            <article className="list-item" role="listitem" key={index}>
                                <section className="item-summary">
                                    {this.renderTimestamp(event, context)}
                                    {this.renderEventName(telemetryModelDefinition, context)}
                                    {this.renderEventSchema(telemetryModelDefinition, context)}
                                    {this.renderEventUnit(telemetryModelDefinition, context)}
                                    {this.renderMessageBody(event, context, event.properties[TELEMETRY_SCHEMA_PROP], parsedSchema)}
                                </section>
                            </article>
                        );
                    })
                }
                </div>
            </div>
        );
    }

    private readonly renderTimestamp = (event: Message, context: LocalizationContextInterface) => {
        return(
            <Label className="column-timestamp-sm" aria-label={context.t(ResourceKeys.deviceEvents.columns.timestamp)}>
                {parseDateTimeString(event.enqueuedTime)}
            </Label>
        );
    }

    private readonly renderEventName = (telemetryModelDefinition: TelemetryContent, context: LocalizationContextInterface) => {
        return(
            <Label className="column-name-sm" aria-label={context.t(ResourceKeys.deviceEvents.columns.displayName)}>
                {telemetryModelDefinition ?
                    `${telemetryModelDefinition.name} (${telemetryModelDefinition.displayName ? telemetryModelDefinition.displayName : '--'}) ` : '--'}
            </Label>
        );
    }

    private readonly renderEventSchema = (telemetryModelDefinition: TelemetryContent, context: LocalizationContextInterface) => {
        return(
            <Label className="column-schema-sm" aria-label={context.t(ResourceKeys.deviceEvents.columns.schema)}>
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
                    telemetryModelDefinition.unit || telemetryModelDefinition.displayUnit || '--' : '--'}
            </Label>
        );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly renderMessageBody = (event: Message, context: LocalizationContextInterface, key: string, schema: ParsedJsonSchema) => {
        if (!key) {
            return;
        }

        const validator = new Validator();
        if (Object.keys(event.body) && Object.keys(event.body)[0] !== key) { // validate telemetry's property name
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

        let result: ValidatorResult;
        if (schema && getNumberOfMapsInSchema(schema) <= 0) {
            // only validate telemetry if schema doesn't contain map type
            result = validator.validate(event.body[key], schema);  // validate telemetry's property value
        }

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
            <div key="custom-loader">
                <div className="events-loader">
                    <Spinner/>
                    <h4>{context.t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</h4>
                </div>
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
                        fetchSystemProperties: true,
                        hubConnectionString: this.props.connectionString,
                        startTime: this.state.startTime})
                    .then((results: Message[]) => {
                        const messages = results && results
                                .filter(result => result && result.systemProperties &&
                                        result.systemProperties[TELEMETRY_INTERFACE_NAME_PROP] === this.props.interfaceName)
                                .reverse().map((message: Message) => message);
                        if (this.isComponentMounted) {
                            this.setState({
                                events: [...messages, ...this.state.events],
                                loading: false,
                                startTime: new Date()});
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

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }
}
