/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IpcMainInvokeEvent } from 'electron';
import { EventHubConsumerClient, Subscription, ReceivedEventData, earliestEventPosition } from '@azure/event-hubs';
import { Message, StartEventHubMonitoringParameters } from '../interfaces/eventHubInterface';
import { convertIotHubToEventHubsConnectionString } from '../utils/connStringHelper';

const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
const IOTHUB_CONNECTION_MODULE_ID = 'iothub-connection-module-id';
let client: EventHubConsumerClient = null;
let subscription: Subscription = null;

export const onStartMonitoring = async (event: IpcMainInvokeEvent, params: StartEventHubMonitoringParameters): Promise<Message[]>=> {
    return initializeEventHubClient(params).then(() => {
        return []; // todo
    });
}

export const onStopMonitoring = async (): Promise<void> => {
    await subscription.close();
    await client.close();
}

const initializeEventHubClient = async (params: any) =>  {
    if (params.customEventHubConnectionString) {
        client = new EventHubConsumerClient(params.consumerGroup, params.customEventHubConnectionString);
    }
    else {
        client = new EventHubConsumerClient(params.consumerGroup, await convertIotHubToEventHubsConnectionString(params.hubConnectionString));
    }

    subscription = client.subscribe(
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
};

const handleMessages = (events: ReceivedEventData[], params: any) => {
    const messages: Message[] = [];
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
    // todo: socket io stuff
    console.log(messages);
}
