/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { useLocation, useHistory } from 'react-router-dom';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/components/TextField';
import { Announced } from 'office-ui-fabric-react/lib/components/Announced';
import { Toggle } from 'office-ui-fabric-react/lib/components/Toggle';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { Message, MESSAGE_SYSTEM_PROPERTIES, MESSAGE_PROPERTIES } from '../../../api/models/messages';
import { parseDateTimeString } from '../../../api/dataTransforms/transformHelper';
import { CLEAR, CHECKED_CHECKBOX, EMPTY_CHECKBOX, START, STOP, NAVIGATE_BACK, REFRESH, REMOVE } from '../../../constants/iconNames';
import { getDeviceIdFromQueryString, getComponentNameFromQueryString, getInterfaceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { MonitorEventsParameters } from '../../../api/parameters/deviceParameters';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { DEFAULT_CONSUMER_GROUP } from '../../../constants/apiConstants';
import { MILLISECONDS_IN_MINUTE } from '../../../constants/shared';
import { appConfig, HostMode } from '../../../../appConfig/appConfig';
import { HeaderView } from '../../../shared/components/headerView';
import { isValidEventHubConnectionString } from '../../../shared/utils/hubConnectionStringHelper';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { deviceEventsReducer } from '../reducers';
import { EventMonitoringSaga } from '../saga';
import { deviceEventsStateInitial } from '../state';
import { startEventsMonitoringAction, stopEventsMonitoringAction, clearMonitoringEventsAction } from './../actions';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../constants/devices';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import { getDeviceTelemetry, TelemetrySchema } from '../../pnp/components/deviceEvents/dataHelper';
import { ROUTE_PARAMS } from '../../../constants/routes';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { ErrorBoundary } from '../../shared/components/errorBoundary';
import { SemanticUnit } from '../../../shared/units/components/semanticUnit';
import { getSchemaValidationErrors } from '../../../shared/utils/jsonSchemaAdaptor';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { TelemetryContent } from '../../../api/models/modelDefinition';
import { getLocalizedData } from '../../../api/dataTransforms/modelDefinitionTransform';
import '../../../css/_deviceEvents.scss';

const JSON_SPACES = 2;
const LOADING_LOCK = 2000;

export const DeviceEvents: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ localState, dispatch ] = useAsyncSagaReducer(deviceEventsReducer, EventMonitoringSaga, deviceEventsStateInitial(), 'deviceEventsState');
    const synchronizationStatus = localState.synchronizationStatus;
    const events = localState.payload;

    // event hub settings
    const [ consumerGroup, setConsumerGroup] = React.useState(DEFAULT_CONSUMER_GROUP);
    const [ customEventHubConnectionString, setCustomEventHubConnectionString] = React.useState(undefined);
    const [ customEventHubName, setCustomEventHubName] = React.useState(undefined);
    const [ startTime, SetStartTime] = React.useState(new Date(new Date().getTime() - MILLISECONDS_IN_MINUTE));
    const [ useBuiltInEventHub, setUseBuiltInEventHub] = React.useState(true);
    const [ showSystemProperties, setShowSystemProperties ] = React.useState(false);

    // event message state
    const [ loadingAnnounced, setLoadingAnnounced ] = React.useState(undefined);
    const [ monitoringData, setMonitoringData ] = React.useState(false);

    // pnp events specific
    const TELEMETRY_SCHEMA_PROP = MESSAGE_PROPERTIES.IOTHUB_MESSAGE_SCHEMA;
    const componentName = getComponentNameFromQueryString(search); // if component name exist, we are in pnp context
    const interfaceId = getInterfaceIdFromQueryString(search);
    const { pnpState, getModelDefinition } = usePnpStateContext();
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const isLoading = pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;
    const telemetrySchema = React.useMemo(() => getDeviceTelemetry(modelDefinition), [modelDefinition]);
    const [ showPnpModeledEvents, setShowPnpModeledEvents ] = React.useState(false);

    React.useEffect(() => {
        return () => {
            stopMonitoring();
        };
    },              []);

    // tslint:disable-next-line: cyclomatic-complexity
    React.useEffect(() => {
        if (synchronizationStatus === SynchronizationStatus.fetched) {
            if (appConfig.hostMode === HostMode.Electron) {
                if (monitoringData) {
                    SetStartTime(new Date());
                    setTimeout(() => {
                        fetchData();
                    },         LOADING_LOCK);
                }
                else {
                    stopMonitoring();
                }
            }
            else {
                stopMonitoring();
            }
        }
        if (synchronizationStatus === SynchronizationStatus.upserted) {
            SetStartTime(new Date());
            setMonitoringData(false);
        }
        if (monitoringData && synchronizationStatus === SynchronizationStatus.failed) {
            stopMonitoring();
        }
    },              [synchronizationStatus]);

    const createCommandBarItems = (): ICommandBarItemProps[] => {
        if (componentName) {
            return [createStartMonitoringCommandItem(),
                createPnpModeledEventsCommandItem(),
                createSystemPropertiesCommandItem(),
                createRefreshCommandItem(),
                createClearCommandItem()
            ];
        }
        else {
            return [createStartMonitoringCommandItem(),
                createSystemPropertiesCommandItem(),
                createClearCommandItem()
            ];
        }
    };

    const createClearCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.clearEvents),
            iconProps: {
                iconName: REMOVE
            },
            key: CLEAR,
            name: t(ResourceKeys.deviceEvents.command.clearEvents),
            onClick: onClearData
        };
    };

    const createSystemPropertiesCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.showSystemProperties),
            disabled: synchronizationStatus === SynchronizationStatus.updating || showPnpModeledEvents,
            iconProps: {
                iconName: showSystemProperties ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: CHECKED_CHECKBOX,
            name: t(ResourceKeys.deviceEvents.command.showSystemProperties),
            onClick: onShowSystemProperties
        };
    };

    const createPnpModeledEventsCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: 'Show modeled events',
            iconProps: {
                iconName: showPnpModeledEvents ? CHECKED_CHECKBOX : EMPTY_CHECKBOX
            },
            key: EMPTY_CHECKBOX,
            name: 'Show modeled events',
            onClick: onShowPnpModeledEvents
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

    const stopMonitoring = () => {
        dispatch(stopEventsMonitoringAction.started());
    };

    const onToggleStart = () => {
        if (monitoringData) {
            setMonitoringData(false);
            setLoadingAnnounced(undefined);
        } else {
            fetchData();
            setMonitoringData(true);
            setLoadingAnnounced(<Announced message={t(ResourceKeys.deviceEvents.infiniteScroll.loading)}/>);
        }
    };

    const filterMessage = (message: Message) => {
        if (!message || !message.systemProperties) {
            return false;
        }
        if (componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN) {
            // for default component, we only expect ${IOTHUB_INTERFACE_ID} to be in the system property not ${IOTHUB_COMPONENT_NAME}
            return message.systemProperties[MESSAGE_SYSTEM_PROPERTIES.IOTHUB_INTERFACE_ID] === interfaceId &&
                !message.systemProperties[MESSAGE_SYSTEM_PROPERTIES.IOTHUB_COMPONENT_NAME];
        }
        return message.systemProperties[MESSAGE_SYSTEM_PROPERTIES.IOTHUB_COMPONENT_NAME] === componentName;
    };

    const renderRawEvents = () => {
        const filteredEvents = componentName ? events.filter(result => filterMessage(result)) : events;
        return (
            <div className={componentName ? 'scrollable-pnp-telemetry' : 'scrollable-telemetry'}>
            {
                filteredEvents && filteredEvents.map((event: Message, index) => {
                    const modifiedEvents = showSystemProperties ? event : {
                        body: event.body,
                        enqueuedTime: event.enqueuedTime,
                        properties: event.properties
                    };
                    return (
                        <article key={index} className="device-events-content">
                            {<h5>{parseDateTimeString(modifiedEvents.enqueuedTime)}:</h5>}
                            <pre>{JSON.stringify(modifiedEvents, undefined, JSON_SPACES)}</pre>
                        </article>
                    );
                })
            }
            </div>
        );
    };

    //#region pnp specific render
    const renderPnpModeledEvents = () => {
        return (
            <div className={componentName ? 'scrollable-pnp-telemetry' : 'scrollable-telemetry'}>
                {
                    events && events.length > 0 &&
                    <>
                        <div className="pnp-modeled-list">
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

    const renderMessageBodyWithValueValidation = (eventBody: any, schema: ParsedJsonSchema, key: string) => { // tslint:disable-line:no-any
        const errors = getSchemaValidationErrors(eventBody[key], schema, true);

        return(
            <div className="column-value-text col-sm4">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                    {errors.length !== 0 &&
                        <section className="value-validation-error" aria-label={t(ResourceKeys.deviceEvents.columns.validation.value.label)}>
                            <span>{t(ResourceKeys.deviceEvents.columns.validation.value.label)}</span>
                            <ul>
                            {errors.map((element, index) =>
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

    const getModelDefinitionAndSchema = (key: string): TelemetrySchema => {
        const matchingSchema = telemetrySchema.filter(schema => schema.telemetryModelDefinition.name === key);
        const telemetryModelDefinition =  matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].telemetryModelDefinition;
        const parsedSchema = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].parsedSchema;
        return {
            parsedSchema,
            telemetryModelDefinition
        };
    };

    const createRefreshCommandItem = (): ICommandBarItemProps => {
        return {
            ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
            disabled: synchronizationStatus === SynchronizationStatus.updating,
            iconProps: {iconName: REFRESH},
            key: REFRESH,
            name: t(ResourceKeys.deviceEvents.command.refresh),
            onClick: getModelDefinition
        };
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

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/events\/.*/, ``);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };
    //#endregion

    const renderLoader = (): JSX.Element => {
        return (
            <>
                {monitoringData && (
                    <div key="loading" className="events-loader">
                        <Spinner/>
                        <h4>{t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</h4>
                    </div>
                )}
            </>
        );
    };

    const fetchData = () => {
        let parameters: MonitorEventsParameters = {
            consumerGroup,
            deviceId,
            startTime
        };

        if (!useBuiltInEventHub) {
            parameters = {
                ...parameters,
                customEventHubConnectionString,
                customEventHubName
            };
        }

        dispatch(startEventsMonitoringAction.started(parameters));
    };

    const onClearData = () => {
        dispatch(clearMonitoringEventsAction());
    };

    const onShowSystemProperties = () => {
        setShowSystemProperties(!showSystemProperties);
    };

    const onShowPnpModeledEvents = () => {
        setShowPnpModeledEvents(!showPnpModeledEvents);
    };

    if (isLoading) {
        return <MultiLineShimmer/>;
    }

    return (
        <div className="device-events" key="device-events">
            <CommandBar
                className="command"
                items={createCommandBarItems()}
                farItems={componentName && [createNavigateBackCommandItem()]}
            />
            <HeaderView
                headerText={ResourceKeys.deviceEvents.headerText}
                tooltip={ResourceKeys.deviceEvents.tooltip}
            />
            {renderConsumerGroup()}
            {renderCustomEventHub()}
            <div className="device-events-container">
                {renderLoader()}
                {showPnpModeledEvents ? renderPnpModeledEvents() : renderRawEvents()}
            </div>
            {loadingAnnounced}
        </div>
    );
};
