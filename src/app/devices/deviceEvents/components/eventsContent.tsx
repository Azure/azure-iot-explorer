/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@fluentui/react';
import { useLocation } from 'react-router-dom';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { Message, MESSAGE_SYSTEM_PROPERTIES, MESSAGE_PROPERTIES, IOTHUB_MESSAGE_SOURCE_TELEMETRY } from '../../../api/models/messages';
import { getComponentNameFromQueryString, getInterfaceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../constants/devices';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import { getDeviceTelemetry, TelemetrySchema } from '../../pnp/components/deviceEvents/dataHelper';
import { ErrorBoundary } from '../../shared/components/errorBoundary';
import { SemanticUnit } from '../../../shared/units/components/semanticUnit';
import { getSchemaType, getSchemaValidationErrors } from '../../../shared/utils/jsonSchemaAdaptor';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { TelemetryContent } from '../../../api/models/modelDefinition';
import { getLocalizedData } from '../../../api/dataTransforms/modelDefinitionTransform';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../../../app/constants/telemetry';

const JSON_SPACES = 2;
interface EventsContentProps {
    showSystemProperties: boolean;
    showPnpModeledEvents: boolean;
}
export const EventsContent: React.FC<EventsContentProps> = ({showSystemProperties, showPnpModeledEvents}) => {
    React.useEffect(
        () => {
            if (componentName) {
                AppInsightsClient.getInstance()?.trackPageView({ name: TELEMETRY_PAGE_NAMES.PNP_TELEMETRY });
            } else {
                AppInsightsClient.getInstance()?.trackPageView({ name: TELEMETRY_PAGE_NAMES.DEVICE_TELEMETRY });
            }
        },
        []);

    const { t } = useTranslation();
    const { search } = useLocation();
    const [ {message: events} ] = useDeviceEventsStateContext();
    const { pnpState, } = usePnpStateContext();

    const TELEMETRY_SCHEMA_PROP = MESSAGE_PROPERTIES.IOTHUB_MESSAGE_SCHEMA;
    const componentName = getComponentNameFromQueryString(search); // if component name exist, we are in pnp context
    const interfaceId = getInterfaceIdFromQueryString(search);
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const telemetrySchema = React.useMemo(() => getDeviceTelemetry(modelDefinition), [modelDefinition]);

    // tslint:disable-next-line: cyclomatic-complexity
    const filterMessage = (message: Message) => {
        if (!message || !message.systemProperties) {
            return false;
        }
        if (message.systemProperties[MESSAGE_SYSTEM_PROPERTIES.IOTHUB_MESSAGE_SOURCE] &&
            message.systemProperties[MESSAGE_SYSTEM_PROPERTIES.IOTHUB_MESSAGE_SOURCE].toLowerCase() !== IOTHUB_MESSAGE_SOURCE_TELEMETRY) {
            // filter out telemetry sent from other sources
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
        const filteredEvents = componentName ? events?.filter(result => filterMessage(result)) : events;
        return (
            <>
                {
                    filteredEvents && filteredEvents.map((event: Message, index) => {
                        const modifiedEvents = showSystemProperties ? event : {
                            body: event.body,
                            enqueuedTime: event.enqueuedTime,
                            properties: event.properties
                        };
                        return (
                            <article key={index} className="device-events-content">
                                {<h5>{modifiedEvents.enqueuedTime}:</h5>}
                                <pre>{JSON.stringify(modifiedEvents, undefined, JSON_SPACES)}</pre>
                            </article>
                        );
                    })
                }
            </>
        );
    };

    //#region pnp specific render
    const renderPnpModeledEvents = () => {
        const filteredEvents = componentName ? events.filter(result => filterMessage(result)) : events;
        return (
            <>
                {
                    filteredEvents && filteredEvents.length > 0 &&
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
                                filteredEvents.map((event: Message, index) => {
                                    return !event.systemProperties ? renderEventsWithNoSystemProperties(event, index) :
                                        event.systemProperties[TELEMETRY_SCHEMA_PROP] ?
                                            renderEventsWithSchemaProperty(event, index) :
                                            renderEventsWithNoSchemaProperty(event, index);
                                })
                            }
                        </section>
                    </>
                }
            </>
        );
    };

    const renderEventsWithNoSystemProperties = (event: Message, index: number) => {
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
        return (
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.timestamp)}>
                    {enqueuedTime}
                </Label>
            </div>
        );
    };

    const renderEventName = (telemetryModelDefinition?: TelemetryContent) => {
        const displayName = telemetryModelDefinition ? getLocalizedData(telemetryModelDefinition.displayName) : '';
        return (
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.displayName)}>
                    {telemetryModelDefinition ?
                        `${telemetryModelDefinition.name} (${displayName ? displayName : '--'})` : '--'}
                </Label>
            </div>
        );
    };

    const renderEventSchema = (telemetryModelDefinition?: TelemetryContent) => {
        return (
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.schema)}>
                    {telemetryModelDefinition ? getSchemaType(telemetryModelDefinition.schema) : '--'}
                </Label>
            </div>
        );
    };

    const renderEventUnit = (telemetryModelDefinition?: TelemetryContent) => {
        return (
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.unit)}>
                    <SemanticUnit unitHost={telemetryModelDefinition} />
                </Label>
            </div>
        );
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const renderMessageBodyWithSchema = (eventBody: any, schema: ParsedJsonSchema, key: string) => { // tslint:disable-line:no-any
        if (key && !schema) { // DTDL doesn't contain corresponding key
            const labelContent = t(ResourceKeys.deviceEvents.columns.validation.key.isNotSpecified, { key });
            return (
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
            return (
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

        return (
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
        return (
            <div className="column-value-text col-sm4">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                    {JSON.stringify(eventBody, undefined, JSON_SPACES)}
                </Label>
            </div>
        );
    };

    const getModelDefinitionAndSchema = (key: string): TelemetrySchema => {
        const matchingSchema = telemetrySchema.filter(schema => schema.telemetryModelDefinition.name === key);
        const telemetryModelDefinition = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].telemetryModelDefinition;
        const parsedSchema = matchingSchema && matchingSchema.length !== 0 && matchingSchema[0].parsedSchema;
        return {
            parsedSchema,
            telemetryModelDefinition
        };
    };
    //#endregion

    return (
        <div className={componentName ? 'pnp-telemetry' : ''}>
            {showPnpModeledEvents ? renderPnpModeledEvents() : renderRawEvents()}
        </div>
    );
};
