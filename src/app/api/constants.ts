/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum HTTP_OPERATION_TYPES {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT'
}

export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const APPLICATION_JSON = 'application/json';
export const ERROR_TYPES = {
    AUTHORIZATION_RULE_NOT_FOUND: 'authorizationRuleNotFound',
    HTTP: 'http',
    PORT_IS_IN_USE: 'portIsInUse'
};
