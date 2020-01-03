/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ModuleTwin {
    deviceId: string;
    moduleId: string;
    etag: string;
    deviceEtag: string;
    status: string;
    statusUpdateTime: string;
    lastActivityTime: string;
    x509Thumbprint: object;
    version: number;
    tags?: object;
    configurations?: object;
    connectionState: string;
    cloudToDeviceMessageCount: number;
    authenticationType: string;
    properties: {
        desired?: object,
        reported?: object;
    };
}
