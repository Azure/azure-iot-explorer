/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Validator, ValidatorResult } from 'jsonschema';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/components/TextField';
import { Announced } from 'office-ui-fabric-react/lib/components/Announced';
import { Toggle } from 'office-ui-fabric-react/lib/components/Toggle';
import { useLocation, useHistory } from 'react-router-dom';
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
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { NotificationType } from '../../../../api/models/notification';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { LabelWithTooltip } from '../../../../shared/components/labelWithTooltip';
import { MILLISECONDS_IN_MINUTE } from '../../../../constants/shared';
import { appConfig, HostMode } from '../../../../../appConfig/appConfig';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { usePnpStateContext } from '../../../../shared/contexts/pnpStateContext';
import { getDeviceTelemetry, TelemetrySchema } from './dataHelper';
import '../../../../css/_deviceEvents.scss';

const JSON_SPACES = 2;
const LOADING_LOCK = 50;
const TELEMETRY_SCHEMA_PROP = MESSAGE_PROPERTIES.IOTHUB_MESSAGE_SCHEMA;

export const DeviceEventsPerInterface: React.FC = () => {
    let timerID: any; // tslint:disable-line:no-any

    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const componentName = getComponentNameFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    const { pnpState, getModelDefinition } = usePnpStateContext();
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const isLoading = pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;
    const telemetrySchema = React.useMemo(() => getDeviceTelemetry(modelDefinition), [modelDefinition]);

    const [ state, setState ] = React.useState({
        consumerGroup: DEFAULT_CONSUMER_GROUP,
        events: [],
        hasMore: false,
        loading: false,
        loadingAnnounced: undefined,
        monitoringData: false,
        startTime: new Date(new Date().getTime() - MILLISECONDS_IN_MINUTE), // set start time to one minute ago
        synchronizationStatus: SynchronizationStatus.initialized
    });
    const [ showRawEvent, setShowRawEvent ] = React.useState(false);

    React.useEffect(() => {
        return () => {
            stopMonitoring();
        };
    },              []);

    const renderCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    createStartMonitoringCommandItem(),
                    createRefreshCommandItem(),
                    createClearCommandItem()
                ]}
                farItems={[createNavigateBackCommandItem()]}
            />
        );
    };

    const createClearCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.clearEvents),
            disabled: state.events.length === 0 || state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {iconName: REMOVE},
            key: REMOVE,
            name: t(ResourceKeys.deviceEvents.command.clearEvents),
            onClick: onClearData
        };
    };

    const createRefreshCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
            disabled: state.synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {iconName: REFRESH},
            key: REFRESH,
            name: t(ResourceKeys.deviceEvents.command.refresh),
            onClick: getModelDefinition
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

    const createNavigateBackCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.close),
            iconProps: {iconName: NAVIGATE_BACK},
            key: NAVIGATE_BACK,
            name: t(ResourceKeys.deviceEvents.command.close),
            onClick: handleClose
        };
    };

    const consumerGroupChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!!newValue) {
            setState({
                ...state,
                consumerGroup: newValue
            });
        }
    };

    const renderConsumerGroupLabel = () => (consumerGroupProps: ITextFieldProps) => {
        return (
            <LabelWithTooltip
                className={'consumer-group-label'}
                tooltipText={t(ResourceKeys.deviceEvents.consumerGroups.tooltip)}
            >
                {consumerGroupProps.label}
            </LabelWithTooltip>
        );
    };

    const renderRawTelemetryToggle = () => {
        return (
            <Toggle
                className="toggle-button"
                checked={showRawEvent}
                ariaLabel={t(ResourceKeys.deviceEvents.toggleShowRawData.label)}
                label={t(ResourceKeys.deviceEvents.toggleShowRawData.label)}
                onText={t(ResourceKeys.deviceEvents.toggleShowRawData.on)}
                offText={t(ResourceKeys.deviceEvents.toggleShowRawData.off)}
                onChange={changeToggle}
            />
        );
    };

    const changeToggle = () => {
        setShowRawEvent(!showRawEvent);
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
                    hasMore: false,
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
        const InfiniteScroll = require('react-infinite-scroller'); // https://github.com/CassetteRocks/react-infinite-scroller/issues/110
        return (
            <InfiniteScroll
                key="scroll"
                className="device-events-container"
                pageStart={0}
                loadMore={fetchData()}
                hasMore={state.hasMore}
                loader={renderLoader()}
                isReverse={true}
            >
            <section className="list-content">
                {showRawEvent ? renderRawEvents() : renderEvents()}
            </section>
            </InfiniteScroll>
        );
    };

    const renderRawEvents = () => {
        const { events } = state;

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
    };

    const renderEvents = () => {
        const { events } = state;

        return (
            <div className="scrollable-pnp-telemetry">
                {
                    events && events.length > 0 &&
                    <>
                        <div className="pnp-detail-list">
                            <div className="list-header list-header-uncollapsible flex-grid-row">
                                <span className="col-sm2">{t(ResourceKeys.deviceEvents.columns.timestamp)}</span>
                                <span className="col-sm2">{t(ResourceKeys.deviceEvents.columns.displayName)}</span>
                                <span className="col-sm2">{t(ResourceKeys.deviceEvents.columns.schema)}</span>
                                <span className="col-sm2">{t(ResourceKeys.deviceEvents.columns.unit)}</span>
                                <span className="col-sm4">{t(ResourceKeys.deviceEvents.columns.value)}</span>
                            </div>
                        </div>
                        <section role="feed">
                        {
                            events.map((event: Message, index) => {
                                return !event.systemProperties ? renderEventsWithNoSystemProperties(event, index) :
                                    event.systemProperties[TELEMETRY_SCHEMA_PROP] ?
                                        renderEventsWithSchemaProperty(event, index) :
                                        renderEventsWithNoSchemaProperty(event, index);
                            })
                        }
                        </section>
                    </>
                }
            </div>
        );
    };

    const renderEventsWithSchemaProperty = (event: Message, index: number) => {
        const { telemetryModelDefinition, parsedSchema } = getModelDefinitionAndSchema(event.systemProperties[TELEMETRY_SCHEMA_PROP]);

        return (
            <article className="list-item event-list-item" role="article" key={index}>
                <section className="flex-grid-row item-summary">
                    <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                        {renderTimestamp(event.enqueuedTime)}
                        {renderEventName(telemetryModelDefinition)}
                        {renderEventSchema(telemetryModelDefinition)}
                        {renderEventUnit(telemetryModelDefinition)}
                        {renderMessageBodyWithSchema(event.body, parsedSchema, event.systemProperties[TELEMETRY_SCHEMA_PROP])}
                    </ErrorBoundary>
                </section>
            </article>
        );
    };

    const renderEventsWithNoSchemaProperty = (event: Message, index: number) => {
        const telemetryKeys = Object.keys(event.body);
        if (telemetryKeys && telemetryKeys.length !== 0) {
            return telemetryKeys.map((key, keyIndex) => {
                const { telemetryModelDefinition, parsedSchema } = getModelDefinitionAndSchema(key);
                const partialEventBody: any = {}; // tslint:disable-line:no-any
                partialEventBody[key] = event.body[key];
                const isNotItemLast = keyIndex !== telemetryKeys.length - 1;

                return (
                    <article className="list-item event-list-item" role="article" key={key + index}>
                        <section className={`flex-grid-row item-summary ${isNotItemLast && 'item-summary-partial'}`}>
                            <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                                {renderTimestamp(keyIndex === 0 ? event.enqueuedTime : null)}
                                {renderEventName(telemetryModelDefinition)}
                                {renderEventSchema(telemetryModelDefinition)}
                                {renderEventUnit(telemetryModelDefinition)}
                                {renderMessageBodyWithSchema(partialEventBody, parsedSchema, key)}
                            </ErrorBoundary>
                        </section>
                    </article>
                );
            });
        }
        return (
            <article className="list-item event-list-item" role="article" key={index}>
                <section className="flex-grid-row item-summary">
                    <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                        {renderTimestamp(event.enqueuedTime)}
                        {renderEventName()}
                        {renderEventSchema()}
                        {renderEventUnit()}
                        {renderMessageBodyWithSchema(event.body, null, null)}
                    </ErrorBoundary>
                </section>
            </article>
        );
    };

    const renderEventsWithNoSystemProperties = (event: Message, index: number, ) => {
        return (
            <article className="list-item event-list-item" role="article" key={index}>
                <section className="flex-grid-row item-summary">
                    <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                        {renderTimestamp(event.enqueuedTime)}
                        {renderEventName()}
                        {renderEventSchema()}
                        {renderEventUnit()}
                        {renderMessageBodyWithNoSchema(event.body)}
                    </ErrorBoundary>
                </section>
            </article>
        );
    };

    const renderTimestamp = (enqueuedTime: string) => {
        return(
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.timestamp)}>
                    {enqueuedTime && parseDateTimeString(enqueuedTime)}
                </Label>
            </div>
        );
    };

    const renderEventName = (telemetryModelDefinition?: TelemetryContent) => {
        const displayName = telemetryModelDefinition ? getLocalizedData(telemetryModelDefinition.displayName) : '';
        return(
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.displayName)}>
                    {telemetryModelDefinition ?
                        `${telemetryModelDefinition.name} (${displayName ? displayName : '--'})` : '--'}
                </Label>
            </div>
        );
    };

    const renderEventSchema = (telemetryModelDefinition?: TelemetryContent) => {
        return(
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.schema)}>
                    {telemetryModelDefinition ?
                        (typeof telemetryModelDefinition.schema === 'string' ?
                        telemetryModelDefinition.schema :
                        telemetryModelDefinition.schema['@type']) : '--'}
                </Label>
            </div>
        );
    };

    const renderEventUnit = (telemetryModelDefinition?: TelemetryContent) => {
        return(
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.unit)}>
                    <SemanticUnit unitHost={telemetryModelDefinition}/>
                </Label>
            </div>
        );
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const renderMessageBodyWithSchema = (eventBody: any, schema: ParsedJsonSchema, key: string) => { // tslint:disable-line:no-any
        if (key && !schema) { // DTDL doesn't contain corresponding key
            const labelContent = t(ResourceKeys.deviceEvents.columns.validation.key.isNotSpecified, { key });
            return(
                <div className="column-value-text col-sm4">
                    <span aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                        {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                        <Label className="value-validation-error">
                            {labelContent}
                        </Label>
                    </span>
                </div>
            );
        }

        if (eventBody && Object.keys(eventBody) && Object.keys(eventBody)[0] !== key) { // key in event body doesn't match property name
            const labelContent = Object.keys(eventBody)[0] ? t(ResourceKeys.deviceEvents.columns.validation.key.doesNotMatch, {
                expectedKey: key,
                receivedKey: Object.keys(eventBody)[0]
            }) : t(ResourceKeys.deviceEvents.columns.validation.value.bodyIsEmpty);
            return(
                <div className="column-value-text col-sm4">
                    <span aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                        {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                        <Label className="value-validation-error">
                            {labelContent}
                        </Label>
                    </span>
                </div>
            );
        }

        return renderMessageBodyWithValueValidation(eventBody, schema, key);
    };

    // tslint:disable-next-line:cyclomatic-complexity
    const renderMessageBodyWithValueValidation = (eventBody: any, schema: ParsedJsonSchema, key: string) => { // tslint:disable-line:no-any
        const validator = new Validator();
        let result: ValidatorResult;
        if (schema && getNumberOfMapsInSchema(schema) <= 0) {
            // only validate telemetry if schema doesn't contain map type
            result = validator.validate(eventBody[key], schema);
        }

        return(
            <div className="column-value-text col-sm4">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                    {result && result.errors && result.errors.length !== 0 &&
                        <section className="value-validation-error" aria-label={t(ResourceKeys.deviceEvents.columns.validation.value.label)}>
                            <span>{t(ResourceKeys.deviceEvents.columns.validation.value.label)}</span>
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
    };

    const renderMessageBodyWithNoSchema = (eventBody: any) => { // tslint:disable-line:no-any
        return(
            <div className="column-value-text col-sm4">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                </Label>
            </div>
        );
    };

    const renderLoader = (): JSX.Element => {
        return (
            <div key="custom-loader">
                <div className="events-loader">
                    <Spinner/>
                    <h4>{t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</h4>
                </div>
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
                    monitorEvents({
                        consumerGroup: state.consumerGroup,
                        deviceId,
                        fetchSystemProperties: true,
                        startTime: state.startTime})
                    .then((results: Message[]) => {
                        const messages = results && results
                                .filter(result => result && result.systemProperties &&
                                         (result.systemProperties[MESSAGE_SYSTEM_PROPERTIES.IOTHUB_COMPONENT_NAME] === componentName ||
                                          result.systemProperties[MESSAGE_SYSTEM_PROPERTIES.IOTHUB_INTERFACE_ID] === interfaceId))
                                .reverse().map((message: Message) => message);
                        setState({
                            ...state,
                            events: [...messages, ...state.events],
                            loading: false,
                            startTime: new Date()});
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
        setState({
            ...state,
            events: []
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

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/events\/.*/, ``);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    const getModelDefinitionAndSchema = (key: string): TelemetrySchema => {
        const matchingSchema = telemetrySchema.filter(schema => schema.telemetryModelDefinition.name === key);
        const telemetryModelDefinition =  matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].telemetryModelDefinition;
        const parsedSchema = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].parsedSchema;
        return {
            parsedSchema,
            telemetryModelDefinition
        };
    };

    if (isLoading) {
        return <MultiLineShimmer/>;
    }

    return (
        <div className="device-events" key="device-events">
            {renderCommandBar()}
            {telemetrySchema && telemetrySchema.length === 0 ?
                <Label className="no-pnp-content">{t(ResourceKeys.deviceEvents.noEvent, {componentName})}</Label> :
                <>
                    <TextField
                        className={'consumer-group-text-field'}
                        onRenderLabel={renderConsumerGroupLabel()}
                        label={t(ResourceKeys.deviceEvents.consumerGroups.label)}
                        ariaLabel={t(ResourceKeys.deviceEvents.consumerGroups.label)}
                        underlined={true}
                        value={state.consumerGroup}
                        disabled={state.monitoringData}
                        onChange={consumerGroupChange}
                    />
                    {renderRawTelemetryToggle()}
                    {renderInfiniteScroll()}
                </>
            }
            {state.loadingAnnounced}
        </div>
    );
};
