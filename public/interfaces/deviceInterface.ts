/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface MessageProperty {
    key: string;
    isSystemProperty: boolean;
    value: string;
}

export interface SendMessageToDeviceParameters {
    connectionString: string;
    deviceId: string;
    messageBody: string;
    messageProperties?: MessageProperty[];
}

export interface DeviceInterface {
    sendMessageToDeviceParameters(params: SendMessageToDeviceParameters): Promise<void>;
}
