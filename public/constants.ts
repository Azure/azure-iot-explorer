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
    DEVICE_SEND_MESSAGE: 'device_sendMessage',
    DIRECTORY_GET_DIRECTORIES: 'directory_getDirectories',
    EVENTHUB_START_MONITORING: 'eventhub_startMonitoring',
    EVENTHUB_STOP_MONITORING: 'eventhub_stopMonitoring',
    MODEL_REPOSITORY_GET_DEFINITION: 'model_definition',
    SETTING_HIGH_CONTRAST: 'setting_highContrast',
};

export const API_INTERFACES = {
    AUTHENTICATION: 'api_authentication',
    DEVICE: 'api_device',
    DIRECTORY: 'api_directory',
    EVENTHUB: 'api_eventhub',
    MODEL_DEFINITION: 'api_modelDefinition',
    SETTINGS: 'api_settings'
};
