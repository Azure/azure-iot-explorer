/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Validator, ValidatorResult } from 'jsonschema';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { RouteComponentProps, Route } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { monitorEvents, stopMonitoringEvents } from '../../../../api/services/devicesService';
import { Message, MESSAGE_SYSTEM_PROPERTIES, MESSAGE_PROPERTIES } from '../../../../api/models/messages';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { REFRESH, STOP, START, REMOVE, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { TelemetryContent } from '../../../../api/models/modelDefinition';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { getNumberOfMapsInSchema } from '../../../../shared/utils/twinAndJsonSchemaDataConverter';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { DEFAULT_CONSUMER_GROUP } from '../../../../constants/apiConstants';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { MILLISECONDS_IN_MINUTE } from '../../../../constants/shared';
import { appConfig, HostMode } from '../../../../../appConfig/appConfig';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import '../../../../css/_deviceEvents.scss';

const JSON_SPACES = 2;
const LOADING_LOCK = 50;
const TELEMETRY_SCHEMA_PROP = MESSAGE_PROPERTIES.IOTHUB_MESSAGE_SCHEMA;
const TELEMETRY_INTERFACE_NAME_PROP = MESSAGE_SYSTEM_PROPERTIES.IOTHUB_INTERFACE_NAME;

export interface DeviceEventsDataProps {
    connectionString: string;
    isLoading: boolean;
    telemetrySchema: TelemetrySchema[];
    componentName: string;
}

export interface DeviceEventsDispatchProps {
    setComponentName: (id: string) => void;
    refresh: (deviceId: string, interfaceId: string) => void;
}

export interface TelemetrySchema {
    parsedSchema: ParsedJsonSchema;
    telemetryModelDefinition: TelemetryContent;
}

export interface DeviceEventsState {
    consumerGroup: string;
    events: Message[];
    hasMore: boolean;
    startTime: Date;
    synchronizationStatus: SynchronizationStatus;
    monitoringData: boolean;
    showRawEvent: boolean;

    loading?: boolean;
    loadingAnnounced?: JSX.Element;
}

export default class DeviceEventsPerInterfaceComponent extends React.Component<DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps, DeviceEventsState> {
    private timerID: any; // tslint:disable-line:no-any
    private isComponentMounted: boolean;
    constructor(props: DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps) {
        super(props);
        this.state = {
            consumerGroup: DEFAULT_CONSUMER_GROUP,
            events: [],
            hasMore: false,
            monitoringData: false,
            showRawEvent: false,
            startTime: new Date(new Date().getTime() - MILLISECONDS_IN_MINUTE), // set start time to one minute ago
            synchronizationStatus: SynchronizationStatus.initialized
        };
    }

    public componentWillUnmount() {
        this.stopMonitoring();
        this.isComponentMounted = false;
      }

    public render(): JSX.Element {
        if (this.props.isLoading) {
            return <MultiLineShimmer/>;
        }

        const { telemetrySchema } = this.props;
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="device-events" key="device-events">
                        {this.renderCommandBar(context)}
                        <Route component={DigitalTwinHeaderContainer} />
                        {telemetrySchema && telemetrySchema.length === 0 ?
                            <Label className="no-pnp-content">{context.t(ResourceKeys.deviceEvents.noEvent, {componentName: getComponentNameFromQueryString(this.props)})}</Label> :
                            <>
                                <TextField
                                    className={'consumer-group-text-field'}
                                    onRenderLabel={this.renderConsumerGroupLabel(context)}
                                    label={context.t(ResourceKeys.deviceEvents.consumerGroups.label)}
                                    ariaLabel={context.t(ResourceKeys.deviceEvents.consumerGroups.label)}
                                    underlined={true}
                                    value={this.state.consumerGroup}
                                    disabled={this.state.monitoringData}
                                    onChange={this.consumerGroupChange}
                                />
                                {this.renderRawTelemetryToggle(context)}
                                {this.renderInfiniteScroll(context)}
                            </>
                        }
                        {this.state.loadingAnnounced}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private renderCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                className="command"
                items={[
                    this.createStartMonitoringCommandItem(context),
                    this.createRefreshCommandItem(context),
                    this.createClearCommandItem(context)
                ]}
                farItems={[this.createNavigateBackCommandItem(context)]}
            />
        );
    }

    private createClearCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        return {
            ariaLabel: context.t(ResourceKeys.deviceEvents.command.clearEvents),
            disabled: this.state.events.length === 0 || this.state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {iconName: REMOVE},
            key: REMOVE,
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

    private createNavigateBackCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        return {
            ariaLabel: context.t(ResourceKeys.deviceEvents.command.close),
            iconProps: {iconName: NAVIGATE_BACK},
            key: NAVIGATE_BACK,
            name: context.t(ResourceKeys.deviceEvents.command.close),
            onClick: this.handleClose
        };
    }

    private consumerGroupChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!!newValue) {
            this.setState({
                consumerGroup: newValue
            });
        }
    }

    private renderConsumerGroupLabel = (context: LocalizationContextInterface) => (props: ITextFieldProps) => {
        return (
            <LabelWithTooltip
                className={'consumer-group-label'}
                tooltipText={context.t(ResourceKeys.deviceEvents.consumerGroups.tooltip)}
            >
                {props.label}
            </LabelWithTooltip>
        );
    }

    private renderRawTelemetryToggle = (context: LocalizationContextInterface) => {
        return (
            <Toggle
                className="toggle-button"
                checked={this.state.showRawEvent}
                ariaLabel={context.t(ResourceKeys.deviceEvents.toggle.label)}
                label={context.t(ResourceKeys.deviceEvents.toggle.label)}
                onText={context.t(ResourceKeys.deviceEvents.toggle.on)}
                offText={context.t(ResourceKeys.deviceEvents.toggle.off)}
                onChange={this.changeToggle}
            />
        );
    }

    private readonly changeToggle = () => {
        this.setState({
            showRawEvent: !this.state.showRawEvent
        });
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
        this.props.setComponentName(getComponentNameFromQueryString(this.props));
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
                isReverse={true}
            >
            <section className="list-content">
                {this.state.showRawEvent ? this.renderRawEvents() : this.renderEvents(context)}
            </section>
            </InfiniteScroll>
        );
    }

    private readonly renderRawEvents = () => {
        const { events } = this.state;

        return (
            <div className="scrollable-pnp-telemetry">
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

    private readonly renderEvents = (context: LocalizationContextInterface) => {
        const { events } = this.state;

        return (
            <div className="scrollable-pnp-telemetry">
                {
                    events && events.length > 0 &&
                    <>
                        <div className="pnp-detail-list">
                            <div className="list-header list-header-uncollapsible flex-grid-row">
                                <span className="col-sm2">{context.t(ResourceKeys.deviceEvents.columns.timestamp)}</span>
                                <span className="col-sm2">{context.t(ResourceKeys.deviceEvents.columns.displayName)}</span>
                                <span className="col-sm2">{context.t(ResourceKeys.deviceEvents.columns.schema)}</span>
                                <span className="col-sm2">{context.t(ResourceKeys.deviceEvents.columns.unit)}</span>
                                <span className="col-sm4">{context.t(ResourceKeys.deviceEvents.columns.value)}</span>
                            </div>
                        </div>
                        <section role="feed">
                        {
                            events.map((event: Message, index) => {
                                return !event.systemProperties ? this.renderEventsWithNoSystemProperties(event, index, context) :
                                    event.systemProperties[TELEMETRY_SCHEMA_PROP] ?
                                        this.renderEventsWithSchemaProperty(event, index, context) :
                                        this.renderEventsWithNoSchemaProperty(event, index, context);
                            })
                        }
                        </section>
                    </>
                }
            </div>
        );
    }

    private readonly renderEventsWithSchemaProperty = (event: Message, index: number, context: LocalizationContextInterface) => {
        const { telemetryModelDefinition, parsedSchema } = this.getModelDefinitionAndSchema(event.systemProperties[TELEMETRY_SCHEMA_PROP]);

        return (
            <article className="list-item event-list-item" role="article" key={index}>
                <section className="flex-grid-row item-summary">
                    <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                        {this.renderTimestamp(event.enqueuedTime, context)}
                        {this.renderEventName(context, telemetryModelDefinition)}
                        {this.renderEventSchema(context, telemetryModelDefinition)}
                        {this.renderEventUnit(context, telemetryModelDefinition)}
                        {this.renderMessageBodyWithSchema(event.body, context, parsedSchema, event.systemProperties[TELEMETRY_SCHEMA_PROP])}
                    </ErrorBoundary>
                </section>
            </article>
        );
    }

    private readonly renderEventsWithNoSchemaProperty = (event: Message, index: number, context: LocalizationContextInterface) => {
        const telemetryKeys = Object.keys(event.body);
        if (telemetryKeys && telemetryKeys.length !== 0) {
            return telemetryKeys.map((key, keyIndex) => {
                const { telemetryModelDefinition, parsedSchema } = this.getModelDefinitionAndSchema(key);
                const partialEventBody: any = {}; // tslint:disable-line:no-any
                partialEventBody[key] = event.body[key];
                const isNotItemLast = keyIndex !== telemetryKeys.length - 1;

                return (
                    <article className="list-item event-list-item" role="article" key={key + index}>
                        <section className={`flex-grid-row item-summary ${isNotItemLast && 'item-summary-partial'}`}>
                            <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                                {this.renderTimestamp(keyIndex === 0 ? event.enqueuedTime : null, context)}
                                {this.renderEventName(context, telemetryModelDefinition)}
                                {this.renderEventSchema(context, telemetryModelDefinition)}
                                {this.renderEventUnit(context, telemetryModelDefinition)}
                                {this.renderMessageBodyWithSchema(partialEventBody, context, parsedSchema, key)}
                            </ErrorBoundary>
                        </section>
                    </article>
                );
            });
        }
    }

    private readonly renderEventsWithNoSystemProperties = (event: Message, index: number, context: LocalizationContextInterface) => {
        return (
            <article className="list-item event-list-item" role="article" key={index}>
                <section className="flex-grid-row item-summary">
                    <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                        {this.renderTimestamp(event.enqueuedTime, context)}
                        {this.renderEventName(context)}
                        {this.renderEventSchema(context)}
                        {this.renderEventUnit(context)}
                        {this.renderMessageBodyWithNoSchema(event.body, context)}
                    </ErrorBoundary>
                </section>
            </article>
        );
    }

    private readonly renderTimestamp = (enqueuedTime: string, context: LocalizationContextInterface) => {
        return(
            <div className="col-sm2">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.timestamp)}>
                    {enqueuedTime && parseDateTimeString(enqueuedTime)}
                </Label>
            </div>
        );
    }

    private readonly renderEventName = (context: LocalizationContextInterface, telemetryModelDefinition?: TelemetryContent) => {
        const displayName = telemetryModelDefinition ? getLocalizedData(telemetryModelDefinition.displayName) : '';
        return(
            <div className="col-sm2">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.displayName)}>
                    {telemetryModelDefinition ?
                        `${telemetryModelDefinition.name} (${displayName ? displayName : '--'})` : '--'}
                </Label>
            </div>
        );
    }

    private readonly renderEventSchema = (context: LocalizationContextInterface, telemetryModelDefinition?: TelemetryContent) => {
        return(
            <div className="col-sm2">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.schema)}>
                    {telemetryModelDefinition ?
                        (typeof telemetryModelDefinition.schema === 'string' ?
                        telemetryModelDefinition.schema :
                        telemetryModelDefinition.schema['@type']) : '--'}
                </Label>
            </div>
        );
    }

    private readonly renderEventUnit = (context: LocalizationContextInterface, telemetryModelDefinition?: TelemetryContent) => {
        return(
            <div className="col-sm2">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.unit)}>
                    {(telemetryModelDefinition && telemetryModelDefinition.unit) || '--'}
                </Label>
            </div>
        );
    }

    private readonly renderMessageBodyWithSchema = (eventBody: any, context: LocalizationContextInterface, schema: ParsedJsonSchema, key: string) => { // tslint:disable-line:no-any
        if (key && !schema) { // DTDL doesn't contain corresponding key
            const labelContent = context.t(ResourceKeys.deviceEvents.columns.validation.key.isNotSpecified, { key });
            return(
                <div className="column-value-text col-sm4">
                    <span aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                        {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                        <Label className="value-validation-error">
                            {labelContent}
                        </Label>
                    </span>
                </div>
            );
        }

        if (Object.keys(eventBody) && Object.keys(eventBody)[0] !== key) { // key in event body doesn't match property name
            const labelContent = context.t(ResourceKeys.deviceEvents.columns.validation.key.doesNotMatch, {
                expectedKey: key,
                receivedKey: Object.keys(eventBody)[0]
            });
            return(
                <div className="column-value-text col-sm4">
                    <span aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                        {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                        <Label className="value-validation-error">
                            {labelContent}
                        </Label>
                    </span>
                </div>
            );
        }

        return this.renderMessageBodyWithValueValidation(eventBody, context, schema, key);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly renderMessageBodyWithValueValidation = (eventBody: any, context: LocalizationContextInterface, schema: ParsedJsonSchema, key: string) => { // tslint:disable-line:no-any
        const validator = new Validator();
        let result: ValidatorResult;
        if (schema && getNumberOfMapsInSchema(schema) <= 0) {
            // only validate telemetry if schema doesn't contain map type
            result = validator.validate(eventBody[key], schema);
        }

        return(
            <div className="column-value-text col-sm4">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                    {result && result.errors && result.errors.length !== 0 &&
                        <section className="value-validation-error" aria-label={context.t(ResourceKeys.deviceEvents.columns.validation.value.label)}>
                            <span>{context.t(ResourceKeys.deviceEvents.columns.validation.value.label)}</span>
                            <ul>
                            {result.errors.map((element, index) =>
                                <li key={index}>{element.message}</li>
                            )}
                            </ul>
                        </section>
                    }
                </Label>
            </div>
        );
    }

    private readonly renderMessageBodyWithNoSchema = (eventBody: any, context: LocalizationContextInterface) => { // tslint:disable-line:no-any
        return(
            <div className="column-value-text col-sm4">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(eventBody, undefined, JSON_SPACES)}
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

    private readonly fetchData = (context: LocalizationContextInterface) => () => {
        const { loading, monitoringData } = this.state;
        if (!loading && monitoringData) {
            this.setState({
                loading: true,
                loadingAnnounced: <Announced message={context.t(ResourceKeys.deviceEvents.infiniteScroll.loading)}/>
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
                                        result.systemProperties[TELEMETRY_INTERFACE_NAME_PROP] === this.props.componentName)
                                .reverse().map((message: Message) => message);
                        if (this.isComponentMounted) {
                            this.setState({
                                events: [...messages, ...this.state.events],
                                loading: false,
                                startTime: new Date()});
                            this.stopMonitoringIfNecessary();
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

    private readonly handleClose = () => {
        const path = this.props.match.url.replace(/\/ioTPlugAndPlayDetail\/events\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }

    private readonly getModelDefinitionAndSchema = (key: string): TelemetrySchema => {
        const matchingSchema = this.props.telemetrySchema.filter(schema => schema.telemetryModelDefinition.name === key);
        const telemetryModelDefinition =  matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].telemetryModelDefinition;
        const parsedSchema = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].parsedSchema;
        return {
            parsedSchema,
            telemetryModelDefinition
        };
    }
}
