/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { EventHubInterface, StartEventHubMonitoringParameters, Message } from '../interfaces/eventHubInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateEventHubInterface = (): EventHubInterface => {
    return {
        startEventHubMonitoring: async (params: StartEventHubMonitoringParameters): Promise<Message[]> => {
            return invokeInMainWorld<Message[]>(MESSAGE_CHANNELS.EVENTHUB_START_MONITORING, params);
        }
    };
};
