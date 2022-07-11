/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum TELEMETRY_PAGE_NAMES {
    HUBS = 'hub_connections',
    CLOUD_TO_DEVICE_MESSAGE = 'cloud_to_device_message',
    DEVICE_TELEMETRY = 'device_telemetry', // same for device vs pnp telemetry
    DEVICE_IDENTITY = 'device_identity',
    DEVICE_LIST = 'device_list',
    DEVICE_TWIN = 'device_twin',
    DIRECT_METHOD = 'direct_method',
    PNP_HOME = 'pnp:home',
    PNP_COMMANDS = 'pnp:commands',
    PNP_INTERFACES = 'pnp:interfaces',
    PNP_PROPERTIES = 'pnp:properties',
    PNP_DEVICE_SETTINGS = 'pnp:device_settings',
    PNP_REPO_SETTINGS = 'pnp:repo_settings',
    NOTIFICATION_LIST = 'notification_list',
}

export enum TELEMETRY_ACTIONS {
    ADD = 'add',
}

// TODO: see ROUTE_PARTS for reference
