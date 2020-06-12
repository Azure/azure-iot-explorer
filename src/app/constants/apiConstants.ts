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

// model repo .net controller
export const INTERFACE_ID = '?interfaceId=';
export const OBJECTMODEL_PARAMETER = '/objectmodel?interfaceId=';
export const API_MODEL = '/Models';
export const MODEL_ID_REF = '/ref:modelId?';
export const MODEL_ID = 'modelId=';
export const API_VERSION = 'api-version=';
export const AND = '&';

// event hub controller
export const MONITOR = '/monitor';
export const STOP = '/stop';

export const DIGITAL_TWIN_API_VERSION = '2019-07-01-preview';
export const HUB_DATA_PLANE_API_VERSION = '2019-10-01';

export const HEADERS = {
    CONTINUATION_TOKEN: 'x-ms-continuation',
    CREATED_ON: 'x-ms-model-createdon',
    ETAG: 'Etag',
    IF_MATCH: 'If-Match',
    LAST_UPDATED: 'x-ms-model-lastupdated',
    MODEL_ID: 'x-ms-model-id',
    PAGE_SIZE: 'x-ms-max-item-count',
    PUBLISHER_ID: 'x-ms-model-publisher-id',
    PUBLISHER_NAME: 'x-ms-model-publisher-name',
    REQUEST_ID: 'x-ms-request-id'
};

export enum DataPlaneStatusCode{
    SuccessLowerBound = 200,
    SuccessUpperBound = 299,
    NoContentSuccess = 204,
    NotFound = 404
}

export const DEFAULT_CONSUMER_GROUP = '$Default';

const localIp = 'http://127.0.0.1';
const apiPath = '/api';
export const CONTROLLER_API_ENDPOINT =
    appConfig.hostMode ===  HostMode.Browser ?
        `${localIp}:${appConfig.controllerPort}${apiPath}` :
        `${localIp}:${localStorage.getItem(CUSTOM_CONTROLLER_PORT) || appConfig.controllerPort}${apiPath}`;
