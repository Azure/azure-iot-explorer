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
    GET_API_AUTH_TOKEN: 'get_api_auth_token',
    GET_API_CERTIFICATE: 'get_api_certificate',
    GET_API_CERT_FINGERPRINT: 'get_api_cert_fingerprint',
    GET_CUSTOM_PORT: 'get_custom_port',
    SETTING_HIGH_CONTRAST: 'setting_highContrast',
};

export const API_INTERFACES = {
    AUTHENTICATION: 'api_authentication',
    CREDENTIALS: 'api_credentials',
    DEVICE: 'api_device',
    SETTINGS: 'api_settings'
};
