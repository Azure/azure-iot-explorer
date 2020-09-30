/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../appConfig/appConfig';
import { CUSTOM_CONTROLLER_PORT } from './browserStorage';

// express server
export const DATAPLANE = '/DataPlane';
export const EVENTHUB = '/EventHub';
export const MODELREPO = '/ModelRepo';
export const CLOUD_TO_DEVICE = '/CloudToDevice';
export const READ_FILE = '/ReadFile';
export const GET_DIRECTORIES = '/Directories';
export const DEFAULT_DIRECTORY = '$DEFAULT';

// model repo .net controller
export const INTERFACE_ID = '?interfaceId=';
export const OBJECTMODEL_PARAMETER = '/objectmodel?interfaceId=';
export const API_MODEL = '/Models';
export const MODEL_ID_REF = '/ref:modelId?';
export const MODEL_ID = 'modelId=';
export const API_VERSION = 'api-version=';
export const AND = '&';
export const PUBLIC_REPO_HOSTNAME = 'devicemodeltest.azureedge.net';

// event hub controller
export const MONITOR = '/monitor';
export const STOP = '/stop';

export const DIGITAL_TWIN_API_VERSION_PREVIEW = '2020-09-30';
export const MODEL_REPO_API_VERSION = '2020-05-01-preview';
export const HUB_DATA_PLANE_API_VERSION = '2020-06-30-preview';

export const HEADERS = {
    CONTINUATION_TOKEN: 'x-ms-continuation',
    ETAG: 'Etag',
    IF_MATCH: 'If-Match',
    MODEL_CREATED_DATE: 'x-ms-model-created-date',
    MODEL_ID: 'x-ms-model-id',
    MODEL_PUBLISHER_ID: 'x-ms-model-publisher-id',
    MODEL_PUBLISHER_NAME: 'x-ms-model-publisher-name',
    PAGE_SIZE: 'x-ms-max-item-count',
    REQUEST_ID: 'x-ms-request-id'
};

export enum DataPlaneStatusCode{
    SuccessLowerBound = 200,
    Accepted = 202,
    SuccessUpperBound = 299,
    NoContentSuccess = 204,
    NotFound = 404,
    InternalServerError = 500
}

export const DEFAULT_CONSUMER_GROUP = '$Default';

const localIp = 'http://127.0.0.1';
const apiPath = '/api';
export const CONTROLLER_API_ENDPOINT =
    appConfig.hostMode ===  HostMode.Browser ?
        `${localIp}:${appConfig.controllerPort}${apiPath}` :
        `${localIp}:${localStorage.getItem(CUSTOM_CONTROLLER_PORT) || appConfig.controllerPort}${apiPath}`;

export enum HTTP_OPERATION_TYPES {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT'
}

export const APPLICATION_JSON = 'application/json';
export const ERROR_TYPES = {
    AUTHORIZATION_RULE_NOT_FOUND: 'authorizationRuleNotFound',
    HTTP: 'http',
    PORT_IS_IN_USE: 'portIsInUse'
};
