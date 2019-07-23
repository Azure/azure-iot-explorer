/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ResourceKeys } from '../../../localization/resourceKeys';

export const parseConnectionString = (value: string): any => { // tslint:disable-line:no-any
    const connectionObject: any = {}; // tslint:disable-line:no-any

    value.split(';')
    .forEach((segment: string) => {
        const keyValue = segment.split('=');
        connectionObject[keyValue[0]] = keyValue[1];
    });

    return connectionObject;
};
export const validateConnectionString = (value: string): string => {
    if (!value) {
        return ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.required;
    }

    const connectionObject = parseConnectionString(value);

    const { HostName, SharedAccessKey, SharedAccessKeyName } = connectionObject;

    if (HostName && SharedAccessKeyName && SharedAccessKey) {
        return;
    }

    return ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.invalid;
};
