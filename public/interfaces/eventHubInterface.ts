/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Message as MessageInterface } from '../../src/app/api/models/messages';
export interface StartEventHubMonitoringParameters {
    deviceId: string;
    consumerGroup: string;
    startTime: string;
    startListeners: boolean;

    customEventHubName?: string;
    customEventHubConnectionString?: string;
    hubConnectionString?: string;
}

export type Message = MessageInterface;

export interface EventHubInterface {
    startEventHubMonitoring(params: StartEventHubMonitoringParameters): Promise<Message[]>;
    stopEventHubMonitoring(): Promise<void>;
}