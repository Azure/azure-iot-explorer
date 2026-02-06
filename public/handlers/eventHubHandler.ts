/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createHmac } from 'crypto';
import { Buffer } from 'buffer';
import { AmqpError, Connection, ReceiverEvents, parseConnectionString } from 'rhea-promise';
import * as rheaPromise from 'rhea-promise';
import { ErrorNameConditionMapper as AMQPError } from '@azure/core-amqp';
import { EventHubConsumerClient, Subscription, ReceivedEventData, earliestEventPosition } from '@azure/event-hubs';
import { BrowserWindow } from 'electron';
import { MESSAGE_CHANNELS } from '../constants';

export interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    sequenceNumber: number;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}

export interface StartEventHubMonitoringRequest {
    deviceId: string;
    moduleId?: string;
    consumerGroup: string;
    customEventHubConnectionString?: string;
    hubConnectionString?: string;
}

// Module-level state for EventHub monitoring
let messages: Message[] = [];
let timerId: NodeJS.Timeout | null = null;
let client: EventHubConsumerClient | null = null;
let subscription: Subscription | null = null;
let mainWindow: BrowserWindow | null = null;

/**
 * Set the main window reference for sending IPC messages
 */
export const setMainWindow = (window: BrowserWindow): void => {
    mainWindow = window;
};

/**
 * Handle start EventHub monitoring via IPC
 */
export const handleStartEventHubMonitoring = async (
    _event: Electron.IpcMainInvokeEvent,
    params: StartEventHubMonitoringRequest
): Promise<void> => {
    if (!params) {
        throw new Error('Parameters are required');
    }
    // Clean up any existing monitoring session to prevent resource leaks
    await stopClient();
    await initializeEventHubClient(params);
};

/**
 * Handle stop EventHub monitoring via IPC
 */
export const handleStopEventHubMonitoring = async (): Promise<void> => {
    await stopClient();
};

/**
 * Initialize the EventHub client and start monitoring
 */
const initializeEventHubClient = async (params: StartEventHubMonitoringRequest): Promise<void> => {
    if (params.customEventHubConnectionString) {
        client = new EventHubConsumerClient(params.consumerGroup, params.customEventHubConnectionString);
    } else {
        client = new EventHubConsumerClient(
            params.consumerGroup,
            await convertIotHubToEventHubsConnectionString(params.hubConnectionString!)
        );
    }

    subscription = client.subscribe(
        {
            processEvents: async (events) => {
                handleMessages(events, params);
            },
            processError: async (err) => {
                console.log(err); // tslint:disable-line:no-console
            }
        },
        { startPosition: earliestEventPosition }
    );

    // Send messages to renderer in a 0.8 sec interval via IPC
    timerId = setInterval(() => {
        if (mainWindow && !mainWindow.isDestroyed() && messages.length > 0) {
            mainWindow.webContents.send(MESSAGE_CHANNELS.EVENTHUB_MESSAGE_RECEIVED, messages);
        }
        messages = [];
    }, 800);
};

/**
 * Handle incoming EventHub messages
 */
const handleMessages = (events: ReceivedEventData[], params: StartEventHubMonitoringRequest): void => {
    const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
    const IOTHUB_CONNECTION_MODULE_ID = 'iothub-connection-module-id';

    events.forEach(event => {
        if (event?.systemProperties?.[IOTHUB_CONNECTION_DEVICE_ID] === params.deviceId) {
            if (!params.moduleId || event?.systemProperties?.[IOTHUB_CONNECTION_MODULE_ID] === params.moduleId) {
                const message: Message = {
                    body: event.body,
                    enqueuedTime: event.enqueuedTimeUtc.toString(),
                    properties: event.properties,
                    sequenceNumber: event.sequenceNumber
                };
                message.systemProperties = event.systemProperties;
                if (messages.find(item => item.sequenceNumber === message.sequenceNumber)) {
                    return; // do not push message if the same sequence already exist
                }
                messages.push(message);
            }
        }
    });
};

/**
 * Stop the EventHub client and clean up
 */
const stopClient = async (): Promise<void> => {
    console.log('stop client'); // tslint:disable-line:no-console

    if (messages.length >= 1) {
        // send left over messages if any
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send(MESSAGE_CHANNELS.EVENTHUB_MESSAGE_RECEIVED, messages);
        }
        messages = [];
    }

    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }

    await subscription?.close();
    await client?.close();

    subscription = null;
    client = null;
};

/**
 * Type guard for AmqpError.
 */
function isAmqpError(err: any): err is AmqpError { // tslint:disable-line:no-any
    return rheaPromise.isAmqpError(err);
}

/**
 * Generate SAS token for EventHub authentication
 */
function generateSasToken(
    resourceUri: string,
    signingKey: string,
    policyName: string,
    expiresInMins: number
): string {
    resourceUri = encodeURIComponent(resourceUri);

    const expiresInSeconds = Math.ceil(Date.now() / 1000 + expiresInMins * 60);
    const toSign = resourceUri + '\n' + expiresInSeconds;

    // Use the crypto module to create the hmac.
    const hmac = createHmac('sha256', Buffer.from(signingKey, 'base64'));
    hmac.update(toSign);
    const base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

    // Construct authorization string.
    return `SharedAccessSignature sr=${resourceUri}&sig=${base64UriEncoded}&se=${expiresInSeconds}&skn=${policyName}`;
}

/**
 * Converts an IotHub Connection string into an Event Hubs-compatible connection string.
 */
export async function convertIotHubToEventHubsConnectionString(connectionString: string): Promise<string> {
    const { HostName, SharedAccessKeyName, SharedAccessKey } = parseConnectionString<{
        HostName: string;
        SharedAccessKeyName: string;
        SharedAccessKey: string;
    }>(connectionString);

    // Verify that the required info is in the connection string.
    if (!HostName || !SharedAccessKey || !SharedAccessKeyName) {
        throw new Error('Invalid IotHub connection string.');
    }

    // Extract the IotHub name from the hostname.
    const [iotHubName] = HostName.split('.');

    if (!iotHubName) {
        throw new Error('Unable to extract the IotHub name from the connection string.');
    }

    // Generate a token to authenticate to the service.
    const token = generateSasToken(
        `${HostName}/messages/events`,
        SharedAccessKey,
        SharedAccessKeyName,
        5 // token expires in 5 minutes
    );

    const connection = new Connection({
        transport: 'tls',
        host: HostName,
        hostname: HostName,
        username: `${SharedAccessKeyName}@sas.root.${iotHubName}`,
        port: 5671,
        reconnect: false,
        password: token
    });
    await connection.open();

    // Create the receiver that will trigger a redirect error.
    const receiver = await connection.createReceiver({
        source: { address: `amqps://${HostName}/messages/events/$management` },
    });

    return new Promise((resolve, reject) => {
        receiver.on(ReceiverEvents.receiverError, (context) => {
            const error = context.receiver && context.receiver.error;
            if (isAmqpError(error) && error.condition === AMQPError.LinkRedirectError && error.info) {
                const hostname = error.info.hostname;
                // an example: "amqps://iothub.test-1234.servicebus.windows.net:5671/hub-name/$management"
                const iotAddress = error.info.address;
                const regex = /:\d+\/(.*)\/\$management/i;
                const regexResults = regex.exec(iotAddress);
                if (!hostname || !regexResults) {
                    reject(error);
                } else {
                    const eventHubName = regexResults[1];
                    resolve(
                        `Endpoint=sb://${hostname}/;EntityPath=${eventHubName};SharedAccessKeyName=${SharedAccessKeyName};SharedAccessKey=${SharedAccessKey}`
                    );
                }
            } else {
                reject(error);
            }
            connection.close().catch(() => {
                /* ignore error */
            });
        });
    });
}
