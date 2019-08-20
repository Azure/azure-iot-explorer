/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ResourceKeys } from '../../../localization/resourceKeys';
import { getConnectionInfoFromConnectionString } from './../../api/shared/utils';

export const validateConnectionString = (value: string): string => {
    if (!value) {
        return ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.required;
    }

    const connectionObject = getConnectionInfoFromConnectionString(value);
    const { hostName, sharedAccessKey, sharedAccessKeyName } = connectionObject;

    if (hostName && sharedAccessKeyName && sharedAccessKey) {
        return;
    }

    return ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.invalid;
};
