/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum TELEMETRY_PAGE_NAMES {
    HUBS = 'hub_list',
    CLOUD_TO_DEVICE_MESSAGE = 'cloud_to_device_message',
    DEVICE_TELEMETRY = 'device_telemetry', // same for device vs module telemetry
    DEVICE_IDENTITY = 'device_identity',
    DEVICE_LIST = 'device_list',
    DEVICE_TWIN = 'device_twin',
    DEVICE_DIRECT_METHOD = 'device_direct_method',
    PNP_HOME = 'pnp:component_list',
    PNP_COMMANDS = 'pnp:commands',
    PNP_INTERFACES = 'pnp:interface',
    PNP_PROPERTIES = 'pnp:properties',
    PNP_DEVICE_SETTINGS = 'pnp:device_settings',
    PNP_REPO_SETTINGS = 'pnp:repo_settings',
    PNP_TELEMETRY = 'pnp:telemetry',
    NOTIFICATION_LIST = 'notification_list',
    MODULE_IDENTITY = 'module_identity',
    MODULE_LIST = 'module_list',
    MODULE_TWIN = 'module_twin',
    MODULE_DIRECT_METHOD = 'module_direct_method',

}

export enum TELEMETRY_ACTIONS {
    ADD = 'add',
}

// TODO: see ROUTE_PARTS for reference
