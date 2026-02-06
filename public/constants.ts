/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export const PLATFORMS = {
    MAC: 'darwin'
};

export const MESSAGE_CHANNELS = {
    AUTHENTICATION_GET_PROFILE_TOKEN: 'authentication_get_profile_token',
    AUTHENTICATION_LOGIN: 'authentication_login',
    AUTHENTICATION_LOGOUT: 'authentication_logout',
    CREDENTIAL_DELETE: 'credential_delete',
    CREDENTIAL_GET: 'credential_get',
    CREDENTIAL_IS_ENCRYPTION_AVAILABLE: 'credential_is_encryption_available',
    CREDENTIAL_LIST: 'credential_list',
    CREDENTIAL_STORE: 'credential_store',
    SETTING_HIGH_CONTRAST: 'setting_highContrast',

    // Data Plane operations (IPC-based)
    DATA_PLANE_REQUEST: 'data_plane_request',

    // Event Hub operations (IPC-based)
    EVENTHUB_START_MONITORING: 'eventhub_start_monitoring',
    EVENTHUB_STOP_MONITORING: 'eventhub_stop_monitoring',
    EVENTHUB_MESSAGE_RECEIVED: 'eventhub_message_received',

    // File operations (IPC-based)
    READ_LOCAL_FILE: 'read_local_file',
    READ_LOCAL_FILE_NAIVE: 'read_local_file_naive',
    GET_DIRECTORIES: 'get_directories',
};

export const API_INTERFACES = {
    AUTHENTICATION: 'api_authentication',
    CREDENTIALS: 'api_credentials',
    DEVICE: 'api_device',
    SETTINGS: 'api_settings'
};
