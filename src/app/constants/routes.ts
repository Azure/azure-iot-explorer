/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum ROUTE_PARTS {
    ADD = 'add',
    ADD_MODULE_IDENTITY = 'addModuleIdentity',
    COMMANDS = 'commands',
    CLOUD_TO_DEVICE_MESSAGE = 'cloudToDeviceMessage',
    DETAIL = 'detail',
    DEVICES = 'devices',
    DIGITAL_TWINS = 'digitalTwins',
    EVENTS = 'events',
    IDENTITY = 'identity',
    INTERFACES = 'interfaces',
    METHODS = 'methods',
    MODULE_IDENTITY = 'moduleIdentity',
    PROPERTIES = 'properties',
    SETTINGS = 'settings',
    TWIN = 'twin'
}

export enum ROUTE_PARAMS {
    DEVICE_ID = 'id',
    INTERFACE_ID = 'interfaceId',
}
