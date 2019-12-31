/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum ROUTE_PARTS {
    ADD = 'add',
    COMMANDS = 'commands',
    CLOUD_TO_DEVICE_MESSAGE = 'cloudToDeviceMessage',
    DEVICE_DETAIL = 'deviceDetail',
    DEVICES = 'devices',
    DIGITAL_TWINS = 'digitalTwins',
    EVENTS = 'events',
    IDENTITY = 'identity',
    INTERFACES = 'interfaces',
    METHODS = 'methods',
    MODULE_IDENTITY = 'moduleIdentity',
    MODULE_DETAIL = 'moduleDetail',
    PROPERTIES = 'properties',
    SETTINGS = 'settings',
    TWIN = 'twin',
    RESOURCE = 'resources'
}

export enum ROUTE_PARAMS {
    DEVICE_ID = 'deviceId',
    INTERFACE_ID = 'interfaceId',
    MODULE_ID = 'moduleId'
}
