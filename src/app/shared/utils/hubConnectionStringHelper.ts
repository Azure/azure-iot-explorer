/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ResourceKeys } from '../../../localization/resourceKeys';
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

export const isValidEventHubConnectionString = (connectionString: string): boolean => {
    if (!connectionString) {
        return true;
    }
    const pattern = new RegExp('^Endpoint=sb://.*;SharedAccessKeyName=.*;SharedAccessKey=.*$');
    return pattern.test(connectionString);
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
