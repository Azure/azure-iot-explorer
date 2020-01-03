/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { getConnectionInfoFromConnectionString, getRepoConnectionInfoFromConnectionString } from './../../api/shared/utils';

export const generateConnectionStringValidationError  = (value: string): string => {
    if (!value) {
        return ResourceKeys.connectivityPane.connectionStringComboBox.errorMessages.required;
    }

    if (isRepoConnectionString(value)) {
        return ResourceKeys.connectivityPane.connectionStringComboBox.errorMessages.invalid;
    }

    return isHubConnectionString(value) ? null : ResourceKeys.connectivityPane.connectionStringComboBox.errorMessages.invalid;
};

const isRepoConnectionString = (value: string) => {
    const connectionObject = getRepoConnectionInfoFromConnectionString(value);
    return connectionObject.repositoryId;
};

const isHubConnectionString = (value: string) => {
    const connectionObject = getConnectionInfoFromConnectionString(value);
    const { hostName, sharedAccessKey, sharedAccessKeyName } = connectionObject;

    if (hostName && sharedAccessKeyName && sharedAccessKey) {
        return true;
    }

    return false;
};

export const formatConnectionStrings = (connectionStrings: string[], activeConnectionString: string): string[] => {
    const trimmedList = connectionStrings.slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
    const formattedList = trimmedList.filter(s => s !== activeConnectionString);
    formattedList.unshift(activeConnectionString);

    return formattedList;
};
