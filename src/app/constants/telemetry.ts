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

export enum TELEMETRY_EVENTS {
    FETCH_DEVICES = 'fetch_devices',
    INTERNAL_USER = 'internal_user',
    UPDATE_BANNER_DISPLAYED = 'update_banner:displayed',
    UPDATE_BANNER_CLICKED = 'update_banner:clicked',
    USER_ACTION = 'user_action'
}

export enum TELEMETRY_USER_ACTIONS {
    UPDATE_DEVICE_TWIN = 'update_device_twin',
    START_DEVICE_TELEMETRY = 'start_device_telemetry',
    DEVICE_INVOKE_DIRECT_METHOD = 'device_invoke_direct_method',
    SEND_C2D_MESSAGE = 'send_c2d_message',
    ADD_DEVICE = 'add_device',
    ADD_MODULE = 'add_module',
    UPDATE_MODULE_TWIN = 'update_module_twin',
    MODULE_INVOKE_DIRECT_METHOD = 'module_invoke_direct_method',
    PNP_SEND_COMMAND = 'pnp_send_command',
    PNP_UPDATE_PROPERTY = 'pnp_update_property',
    PNP_START_TELEMETRY = 'pnp_start_telemetry'
}
