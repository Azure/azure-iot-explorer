/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

export interface DataPlaneResponse<T> {
    body: T;
    headers: unknown;
}
export interface Device {
    DeviceId: string;
    Status: string;
    StatusUpdatedTime: string;
    LastActivityTime: string;
    CloudToDeviceMessageCount: string;
    AuthenticationType: string;
    IotEdge: boolean;
    '__iot:interfaces'?: {};
}

export interface Twin {
    deviceId: string;
    etag: string;
    deviceEtag: string;
    status: string;
    statusUpdateTime: string;
    lastActivityTime: string;
    x509Thumbprint: object;
    version: number;
    tags?: object;
    capabilities: {
        iotEdge: boolean;
    };
    configurations?: object;
    connectionState: string;
    cloudToDeviceMessageCount: number;
    authenticationType: string;
    properties: {
        desired?: object,
        reported?: object;
    };
}
