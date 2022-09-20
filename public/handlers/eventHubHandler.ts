/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IpcMainInvokeEvent } from 'electron';
import { EventHubClient, EventPosition, ReceiveHandler } from '@azure/event-hubs';
import { Message, StartEventHubMonitoringParameters } from '../interfaces/eventHubInterface';
import { convertIotHubToEventHubsConnectionString } from '../utils/connStringHelper';

let client: EventHubClient = null;
let messages: Message[] = [];
let receivers: ReceiveHandler[] = [];
let connectionString: string = ''; // would equal `${hubConnectionString}` or `${customEventHubConnectionString}/${customEventHubName}`
let deviceId: string = '';
let moduleId: string = '';

const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
const IOTHUB_CONNECTION_MODULE_ID = 'iothub-connection-module-id';

export const onStartMonitoring = async (event: IpcMainInvokeEvent, params: StartEventHubMonitoringParameters): Promise<Message[]>=> {
    return eventHubProvider(params).then(result => {
        return result;
    });
}

export const onStopMonitoring = async (): Promise<void> => {
    try {
        return stopClient();
    } catch (error) {
        // swallow the error as we set client to null anyways
    }
}

const eventHubProvider = async (params: StartEventHubMonitoringParameters) =>  {
    await initializeEventHubClient(params);
    updateEntityIdIfNecessary(params);

    return listeningToMessages(client, params);
};

const initializeEventHubClient = async (params: StartEventHubMonitoringParameters) =>  {
    if (needToCreateNewEventHubClient(params))
    {
        // hub has changed, reinitialize client, receivers and mesages
        if (params.customEventHubConnectionString) {
            client = await EventHubClient.createFromConnectionString(params.customEventHubConnectionString, params.customEventHubName);
        }
        else {
            try {
                client = await EventHubClient.createFromIotHubConnectionString(params.hubConnectionString);
            }
            catch {
                client = await EventHubClient.createFromConnectionString(await convertIotHubToEventHubsConnectionString(params.hubConnectionString));
            }
        }

        connectionString = params.customEventHubConnectionString ?
            `${params.customEventHubConnectionString}/${params.customEventHubName}` :
            params.hubConnectionString;
        receivers = [];
        messages = [];
    }
};

const listeningToMessages = async (eventHubClient: EventHubClient, params: StartEventHubMonitoringParameters) => {
    if (params.startListeners || !receivers) {
        const partitionIds = await client.getPartitionIds();
        const hubInfo = await client.getHubRuntimeInformation();
        const startTime = params.startTime ? Date.parse(params.startTime) : Date.now();

        partitionIds && partitionIds.forEach(async (partitionId: string) => {
            const receiveOptions =  {
                consumerGroup: params.consumerGroup,
                enableReceiverRuntimeMetric: true,
                eventPosition: EventPosition.fromEnqueuedTime(startTime),
                name: `${hubInfo.path}_${partitionId}`,
            };

            const receiver = eventHubClient.receive(
                partitionId,
                onMessageReceived,
                (err: object) => {},
                receiveOptions);
            receivers.push(receiver);
        });
    }

    return handleMessages();
};

const handleMessages = () => {
    let results: Message[] = [];
    messages.forEach(message => {
        if (!results.some(result => result.systemProperties?.['x-opt-sequence-number'] === message.systemProperties?.['x-opt-sequence-number'])) {
            // if user click stop/start too refrequently, it's possible duplicate receivers are created before the cleanup happens as it's async
            // remove duplicate messages before proper cleanup is finished
            results.push(message);
        }
    })
    messages = []; // empty the array everytime the result is returned
    return results;
}

const stopClient = async () => {
    return stopReceivers().then(() => {
        return client && client.close().catch(error => {
            console.log(`client cleanup error: ${error}`); // swallow the error as we will cleanup anyways
        });
    }).finally (() => {
        client = null;
        receivers = [];
    });
};

const stopReceivers = async () => {
    return Promise.all(
        receivers.map(receiver => {
            if (receiver && (receiver.isReceiverOpen === undefined || receiver.isReceiverOpen)) {
                return stopReceiver(receiver);
            } else {
                return null;
            }
        })
    );
};

const stopReceiver = async (receiver: ReceiveHandler) => {
    receiver.stop().catch((err: object) => {
        throw new Error(`receivers cleanup error: ${err}`);
    });
}

const needToCreateNewEventHubClient = (parmas: StartEventHubMonitoringParameters): boolean => {
    return !client ||
        parmas.hubConnectionString && parmas.hubConnectionString !== connectionString  ||
        parmas.customEventHubConnectionString && `${parmas.customEventHubConnectionString}/${parmas.customEventHubName}` !== connectionString;
}

const updateEntityIdIfNecessary = (parmas: StartEventHubMonitoringParameters) => {
    if( !deviceId || parmas.deviceId !== deviceId) {
        deviceId = parmas.deviceId;
        messages = [];
    }
    if (parmas.moduleId !== moduleId) {
        moduleId = parmas.moduleId;
        messages = [];
    }
}

const onMessageReceived = async (eventData: any) => {
    if (eventData && eventData.annotations && eventData.annotations[IOTHUB_CONNECTION_DEVICE_ID] === deviceId) {
        if (!moduleId || eventData?.annotations?.[IOTHUB_CONNECTION_MODULE_ID] === moduleId) {
            const message: Message = {
                body: eventData.body,
                enqueuedTime: eventData.enqueuedTimeUtc.toString(),
                properties: eventData.applicationProperties
            };
            message.systemProperties = eventData.annotations;
            messages.push(message);
        }
    }
};