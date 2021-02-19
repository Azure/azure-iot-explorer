/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Message as MessageInterface } from '../../../../public/interfaces/eventHubInterface';
export type Message = MessageInterface;

export enum MESSAGE_PROPERTIES {
    IOTHUB_MESSAGE_SCHEMA = 'iothub-message-schema'
}

export enum MESSAGE_SYSTEM_PROPERTIES {
    IOTHUB_CONNECTION_AUTH_GENERATION_ID = 'iothub-connection-auth-generation-id',
    IOTHUB_CONNECTION_AUTH_METHOD = 'iothub-connection-auth-method',
    IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id',
    IOTHUB_COMPONENT_NAME = 'dt-subject',
    IOTHUB_INTERFACE_ID = 'dt-dataschema',
    IOTHUB_MESSAGE_SOURCE = 'iothub-message-source',
    IOTHUB_ENQUEUED_TIME = 'iothub-enqueuedtime'
}

export const IOTHUB_MESSAGE_SOURCE_TELEMETRY = 'telemetry';
