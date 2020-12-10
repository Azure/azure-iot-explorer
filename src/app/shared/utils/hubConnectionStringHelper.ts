/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ConnectionStringWithExpiry } from '../../connectionStrings/state';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
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
    const trimmedList = connectionStrings.slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
    const connectionStringWithExpiry = trimmedList.find(s => s.connectionString === activeConnectionString);
    const formattedList = trimmedList.filter(s => s.connectionString !== activeConnectionString);
    formattedList.unshift(connectionStringWithExpiry);

    return formattedList;
};

export const isValidEventHubConnectionString = (connectionString: string): boolean => {
    if (!connectionString) {
        return true;
    }
    const pattern = new RegExp('^Endpoint=sb://.*;SharedAccessKeyName=.*;SharedAccessKey=.*$');
    return pattern.test(connectionString);
};
