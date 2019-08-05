/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
declare const _CONTROLLER_ENDPOINT: string;

// express server
export const CONTROLLER_API_ENDPOINT = (`${_CONTROLLER_ENDPOINT}/api`).replace(/([^:]\/)\/+/, '$1');
export const DATAPLANE = '/DataPlane';
export const EVENTHUB = '/EventHub';
export const MODELREPO = '/ModelRepo';

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

// digital twin api version
export const DIGITAL_TWIN_API_VERSION = '2019-07-01-preview';

export const HEADERS = {
    CREATED_ON: 'x-ms-model-createdon',
    ETAG: 'Etag',
    LAST_UPDATED: 'x-ms-model-lastupdated',
    MODEL_ID: 'x-ms-model-id',
    PUBLISHER_ID: 'x-ms-model-publisher-id',
    PUBLISHER_NAME: 'x-ms-model-publisher-name',
    REQUEST_ID: 'x-ms-request-id',
};

export enum DataPlaneStatusCode{
    SuccessLowerBound = 200,
    SuccessUpperBound = 299
}

export const DEFAULT_CONSUMER_GROUP = '$Default';
