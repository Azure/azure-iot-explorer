/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface DeviceSummary {
    deviceId: string;
    status: string;
    lastActivityTime: string;
    statusUpdatedTime: string;
    cloudToDeviceMessageCount: string;
    authenticationType: string;
    connectionState: string;
    iotEdge: boolean;
}
