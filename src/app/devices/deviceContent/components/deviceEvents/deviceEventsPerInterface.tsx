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
import { RouteComponentProps, Route } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { monitorEvents, stopMonitoringEvents } from '../../../../api/services/devicesService';
import { Message, MESSAGE_SYSTEM_PROPERTIES, MESSAGE_PROPERTIES } from '../../../../api/models/messages';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { REFRESH, STOP, START, CLOSE, REMOVE } from '../../../../constants/iconNames';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { TelemetryContent } from '../../../../api/models/modelDefinition';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { getNumberOfMapsInSchema } from '../../../../shared/utils/twinAndJsonSchemaDataConverter';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { DEFAULT_CONSUMER_GROUP } from '../../../../constants/apiConstants';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { MILLISECONDS_IN_MINUTE } from '../../../../constants/shared';
import { appConfig, HostMode } from '../../../../../appConfig/appConfig';
import '../../../../css/_deviceEvents.scss';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

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

export interface DeviceEventsState {
    consumerGroup: string;
    events: Message[];
    hasMore: boolean;
    startTime: Date; // todo: add a datetime picker
    loading?: boolean;
    loadingAnnounced?: JSX.Element;
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
                        <CommandBar
                            className="command"
                            items={this.createCommandBarItems(context)}
                        />
                        <Route component={DigitalTwinHeaderContainer} />
                        {telemetrySchema  ?
                            telemetrySchema.length === 0 ?
                                <Label className="no-pnp-content">{context.t(ResourceKeys.deviceEvents.noEvent, {interfaceName: getInterfaceIdFromQueryString(this.props)})}</Label> :
                                <>
                                    <TextField
                                        className={'consumer-group-text-field'}
                                        onRenderLabel={this.renderConsumerGroupLabel}
                                        label={context.t(ResourceKeys.deviceEvents.consumerGroups.label)}
                                        ariaLabel={context.t(ResourceKeys.deviceEvents.consumerGroups.label)}
                                        underlined={true}
                                        value={this.state.consumerGroup}
                                        disabled={this.state.monitoringData}
                                        onChange={this.consumerGroupChange}
                                    />
                                    {this.renderInfiniteScroll(context)}
                                </>
                            : <InterfaceNotFoundMessageBoxContainer/>
                        }
                        {this.state.loadingAnnounced}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private createCommandBarItems = (context: LocalizationContextInterface): ICommandBarItemProps[] => {
        return [
            this.createStartMonitoringCommandItem(context),
            this.createRefreshCommandItem(context),
            this.createClearCommandItem(context),
            this.createCloseCommandItem(context)
        ];
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

    private createCloseCommandItem = (context: LocalizationContextInterface): ICommandBarItemProps => {
        return {
            ariaLabel: context.t(ResourceKeys.deviceEvents.command.close),
            iconProps: {iconName: CLOSE},
            key: CLOSE,
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
                loadingAnnounced: undefined,
                monitoringData: true
            });
        }
    }

    public componentDidMount() {
        this.props.setInterfaceId(getInterfaceIdFromQueryString(this.props));
        this.isComponentMounted = true;
    }

    public componentDidUpdate(oldProps: DeviceEventsDataProps & DeviceEventsDispatchProps & RouteComponentProps) {
        if (getInterfaceIdFromQueryString(oldProps) !== getInterfaceIdFromQueryString(this.props)) {
            this.setState({
                events: [],
                hasMore: false,
                monitoringData: false
            });
        }
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
                {this.renderEvents(context)}
            </section>
            </InfiniteScroll>
        );
    }

    private readonly renderEvents = (context: LocalizationContextInterface) => {
        const { events } = this.state;

        return (
            <div className="scrollable-sm">
                <div className="pnp-detail-list ms-Grid">
                    <div className="list-header list-header-uncollapsible ms-Grid-row">
                        <span className="ms-Grid-col ms-sm2">{context.t(ResourceKeys.deviceEvents.columns.timestamp)}</span>
                        <span className="ms-Grid-col ms-sm2">{context.t(ResourceKeys.deviceEvents.columns.displayName)}</span>
                        <span className="ms-Grid-col ms-sm2">{context.t(ResourceKeys.deviceEvents.columns.schema)}</span>
                        <span className="ms-Grid-col ms-sm2">{context.t(ResourceKeys.deviceEvents.columns.unit)}</span>
                        <span className="ms-Grid-col ms-sm4">{context.t(ResourceKeys.deviceEvents.columns.value)}</span>
                    </div>
                </div>
                {
                    events && events.length > 0 &&
                    <section role="feed">
                    {
                        events.map((event: Message, index) => {
                            return event.systemProperties ? this.renderSingleEvents(event, index, context) : this.renderCombinedEvents(event, index, context);
                        })
                    }
                    </section>
                }
            </div>
        );
    }

    private readonly renderSingleEvents = (event: Message, index: number, context: LocalizationContextInterface) => {
        const matchingSchema = this.props.telemetrySchema.filter(schema => schema.telemetryModelDefinition.name ===
            event.systemProperties[TELEMETRY_SCHEMA_PROP]);
        const telemetryModelDefinition =  matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].telemetryModelDefinition;
        const parsedSchema = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].parsedSchema;

        return (
            <article className="list-item" role="article" key={index}>
                <section className="item-summary">
                    <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                        {this.renderTimestamp(event, context)}
                        {this.renderEventName(context, telemetryModelDefinition)}
                        {this.renderEventSchema(context, telemetryModelDefinition)}
                        {this.renderEventUnit(context, telemetryModelDefinition)}
                        {this.renderMessageBody(event, context, parsedSchema)}
                    </ErrorBoundary>
                </section>
            </article>
        );
    }

    private readonly renderCombinedEvents = (event: Message, index: number, context: LocalizationContextInterface) => {
        return (
            <article className="list-item" role="article" key={index}>
                <section className="item-summary">
                <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                        {this.renderTimestamp(event, context)}
                        {this.renderEventName(context)}
                        {this.renderEventSchema(context)}
                        {this.renderEventUnit(context)}
                        {this.renderMessageBody(event, context)}
                    </ErrorBoundary>
                </section>
            </article>
        );
    }

    private readonly renderTimestamp = (event: Message, context: LocalizationContextInterface) => {
        return(
            <div className="ms-Grid-col ms-sm2">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.timestamp)}>
                    {parseDateTimeString(event.enqueuedTime)}
                </Label>
            </div>
        );
    }

    private readonly renderEventName = (context: LocalizationContextInterface, telemetryModelDefinition?: TelemetryContent) => {
        const displayName = telemetryModelDefinition ? getLocalizedData(telemetryModelDefinition.displayName) : '';
        return(
            <div className="ms-Grid-col ms-sm2">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.displayName)}>
                    {telemetryModelDefinition ?
                        `${telemetryModelDefinition.name} (${displayName ? displayName : '--'})` : '--'}
                </Label>
            </div>
        );
    }

    private readonly renderEventSchema = (context: LocalizationContextInterface, telemetryModelDefinition?: TelemetryContent) => {
        return(
            <div className="ms-Grid-col ms-sm2">
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
        const displayUnit = telemetryModelDefinition ? getLocalizedData(telemetryModelDefinition.displayUnit) : '';
        return(
            <div className="ms-Grid-col ms-sm2">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.unit)}>
                    {telemetryModelDefinition ?
                        telemetryModelDefinition.unit || displayUnit || '--' : '--'}
                </Label>
            </div>
        );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly renderMessageBody = (event: Message, context: LocalizationContextInterface, schema?: ParsedJsonSchema) => {
        const key = event.systemProperties ? event.systemProperties[TELEMETRY_SCHEMA_PROP] : null;
        const validator = new Validator();

        if (!key) {
            return(
                <div className="column-value-text ms-Grid-col ms-sm4">
                    <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                        {JSON.stringify(event.body, undefined, JSON_SPACES)}
                    </Label>
                </div>
            );
        }

        if (Object.keys(event.body) && Object.keys(event.body)[0] !== key) { // validate telemetry's property name
            return(
                <div className="column-value-text ms-Grid-col ms-sm4">
                    <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                        {JSON.stringify(event.body, undefined, JSON_SPACES)}
                        <section className="value-validation-error" aria-label={context.t(ResourceKeys.deviceEvents.columns.error.key.label)}>
                            <span>{context.t(ResourceKeys.deviceEvents.columns.error.key.label)}</span>
                            <ul>
                                <li key={key}>{context.t(ResourceKeys.deviceEvents.columns.error.key.doesNotMatch, {keyName: key})}</li>
                            </ul>
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
            <div className="column-value-text ms-Grid-col s4">
                <Label aria-label={context.t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(event.body, undefined, JSON_SPACES)}
                    {result && result.errors && result.errors.length !== 0 &&
                        <section className="value-validation-error" aria-label={context.t(ResourceKeys.deviceEvents.columns.error.value.label)}>
                            <span>{context.t(ResourceKeys.deviceEvents.columns.error.value.label)}</span>
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
                                        result.systemProperties[TELEMETRY_INTERFACE_NAME_PROP] === this.props.interfaceName)
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
        const path = this.props.match.url.replace(/\/digitalTwinsDetail\/events\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
