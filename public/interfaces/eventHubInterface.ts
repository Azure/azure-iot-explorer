/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface StartEventHubMonitoringParameters {
    deviceId: string;
    moduleId: string;
    consumerGroup: string;
    startTime: string;
    customEventHubConnectionString?: string;
    hubConnectionString?: string;
}

export interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}
