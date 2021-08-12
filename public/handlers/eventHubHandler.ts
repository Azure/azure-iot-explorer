/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IpcMainInvokeEvent } from 'electron';
import { EventHubConsumerClient, ReceivedEventData, earliestEventPosition } from '@azure/event-hubs';
import { Message, StartEventHubMonitoringParameters } from '../interfaces/eventHubInterface';
import { convertIotHubToEventHubsConnectionString } from '../utils/eventHubHelper';

const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
const IOTHUB_CONNECTION_MODULE_ID = 'iothub-connection-module-id';
let hubConnectionString = '';
let eventHubCompatibleConnectionString = '';
let deviceId = '';
let moduleId = '';
let messages: Message[] = [];

export const onStartMonitoring = async (event: IpcMainInvokeEvent, params: StartEventHubMonitoringParameters): Promise<Message[]>=> {  
    await eventHubProvider(params);
    const result = [...messages];
    messages = [];
    return result;
}

const eventHubProvider = async (params: any) =>  {
    let connectionString = '';
    if (params.customEventHubConnectionString) {
        connectionString = params.customEventHubConnectionString;
    }
    else {
        if (params.hubConnectionString != hubConnectionString) {
            connectionString = await convertIotHubToEventHubsConnectionString(params.hubConnectionString);
            // save strings for future use
            hubConnectionString = params.hubConnectionString;
            eventHubCompatibleConnectionString = connectionString;

        }
        else {
            connectionString = eventHubCompatibleConnectionString;
        }
    }

    if (deviceId != params.deviceId || moduleId != params.moduleId) {
        messages = []; // clear the messages when switching identites
        deviceId = params.deviceId;
        moduleId = params.moduleId;
    }

    const client = new EventHubConsumerClient(params.consumerGroup, connectionString); 
    const subscription = client.subscribe(
        {
            processEvents: async (events) => {
                handleMessages(events, params)
            },
            processError: async (err) => {
                console.log(err);
            }
        },
        { startPosition: params.startTime ? { enqueuedOn: new Date(params.startTime).getTime() } : earliestEventPosition }
    );

    // Wait for a few seconds to receive events before closing
    setTimeout(async () => {
        await subscription.close();
        await client.close();
    }, 3 * 1000);
};

const handleMessages = (events: ReceivedEventData[], params: any) => {
    events.forEach(event => {
        if (event?.systemProperties?.[IOTHUB_CONNECTION_DEVICE_ID] === params.deviceId) {
            if (!params.moduleId || event?.systemProperties?.[IOTHUB_CONNECTION_MODULE_ID] === params.moduleId) {
                const message: Message = {
                    body: event.body,
                    enqueuedTime: event.enqueuedTimeUtc.toString(),
                    properties: event.properties
                };
                message.systemProperties = event.systemProperties;
                messages.push(message);
            }
        }
    });
}