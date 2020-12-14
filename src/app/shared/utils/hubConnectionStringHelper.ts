/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringWithExpiry } from '../../connectionStrings/state';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CONNECTION_STRING_EXPIRATION_IN_YEAR, CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { getConnectionInfoFromConnectionString } from './../../api/shared/utils';

export const generateConnectionStringValidationError  = (value: string): string => {
    if (!value) {
        return ResourceKeys.connectivityPane.connectionStringComboBox.errorMessages.required;
    }

    return isHubConnectionString(value) ? null : ResourceKeys.connectivityPane.connectionStringComboBox.errorMessages.invalid;
};

const isHubConnectionString = (value: string) => {
    const connectionObject = getConnectionInfoFromConnectionString(value);
    const { hostName, sharedAccessKey, sharedAccessKeyName } = connectionObject;

    if (hostName && sharedAccessKeyName && sharedAccessKey) {
        return true;
    }

    return false;
};

export const formatConnectionStrings = (connectionStrings: ConnectionStringWithExpiry[], activeConnectionString: string): ConnectionStringWithExpiry[] => {
    const connectionStringWithExpiry = connectionStrings.find(s => s.connectionString === activeConnectionString);
    const filteredList = connectionStrings.filter(s => s.connectionString !== activeConnectionString);
    filteredList.unshift(connectionStringWithExpiry);
    const trimmedList = filteredList.slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
    return trimmedList;
};

export const isValidEventHubConnectionString = (connectionString: string): boolean => {
    if (!connectionString) {
        return true;
    }
    const pattern = new RegExp('^Endpoint=sb://.*;SharedAccessKeyName=.*;SharedAccessKey=.*$');
    return pattern.test(connectionString);
};

export const getDaysBeforeHubConnectionStringExpires = (connectionStringWithExpiry: ConnectionStringWithExpiry) => {
    const millisecondsPerDay = 86400000;
    return Math.floor((Date.parse(connectionStringWithExpiry.expiration) - Date.parse((new Date()).toUTCString()) ) / millisecondsPerDay);
};

export const getExpiryDateInUtcString = () => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + CONNECTION_STRING_EXPIRATION_IN_YEAR);
    return oneYearFromNow.toUTCString();
};

export const getActiveConnectionString = (connectionStrings: string): string => {
    if (!connectionStrings) {
        return;
    }

    try {
        const parsedStrings = JSON.parse(connectionStrings);
        return parsedStrings && parsedStrings[0] && parsedStrings[0].connectionString;
    }
    catch {
        return;
    }
};
