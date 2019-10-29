/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ResourceKeys } from '../../../localization/resourceKeys';
import { getConnectionInfoFromConnectionString, getRepoConnectionInfoFromConnectionString } from './../../api/shared/utils';

export const generateConnectionStringValidationError  = (value: string): string => {
    if (!value) {
        return ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.required;
    }

    if (isRepoConnectionString(value)) {
        return ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.invalid;
    }

    return isHubConnectionString(value) ? null : ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.invalid;
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
