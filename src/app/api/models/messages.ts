/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}

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
