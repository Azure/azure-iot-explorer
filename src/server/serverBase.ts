/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as fs from 'fs';
import * as path from 'path';
import express = require('express');
import request = require('request');
import bodyParser = require('body-parser');
import cors = require('cors');
import { Client as HubClient } from 'azure-iothub';
import { Message as CloudToDeviceMessage } from 'azure-iot-common';
import { EventHubClient, EventPosition, delay, EventHubRuntimeInformation, ReceiveHandler } from '@azure/event-hubs';
import { generateDataPlaneRequestBody, generateDataPlaneResponse } from './dataPlaneHelper';

const SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const SUCCESS = 200;
const NOT_FOUND = 404;
const CONFLICT = 409;
const NO_CONTENT_SUCCESS = 204;
const SERVER_WAIT = 3000; // how long we'll let the call for eventHub messages run in non-socket
const receivers: ReceiveHandler[] = [];
const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';

let client: EventHubClient = null;
let connectionString: string = '';
let eventHubClientStopping = false;

interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}

export default class ServerBase {
    private port: number;
    constructor(port: number) {
        this.port = port;
    }

    public init() {
        const app = express();
        app.use(bodyParser.json());
        app.use(cors({
            credentials: true,
            origin: 'http://127.0.0.1:3000',
        }));

        app.post(dataPlaneUri, handleDataPlanePostRequest);
        app.post(cloudToDeviceUri, handleCloudToDevicePostRequest);
        app.post(eventHubMonitorUri, handleEventHubMonitorPostRequest);
        app.post(eventHubStopUri, handleEventHubStopPostRequest);
        app.post(modelRepoUri, handleModelRepoPostRequest);
        app.get(readFileUri, handleReadFileRequest);

        app.listen(this.port);
    }
}

const readFileUri = '/api/ReadFile/:path/:file';
// tslint:disable-next-line:cyclomatic-complexity
export const handleReadFileRequest = (req: express.Request, res: express.Response) => {
    try {
        const filePath = req.params.path;
        const expectedFileName = req.params.file;
        if (!filePath || !expectedFileName) {
            res.status(BAD_REQUEST).send();
        }
        else {
            const fileNames = fs.readdirSync(filePath);
            try {
                const foundContent = findMatchingFile(filePath, fileNames, expectedFileName);
                if (foundContent) {
                    res.status(SUCCESS).send(foundContent);
                }
                else {
                    res.status(NO_CONTENT_SUCCESS).send();
                }
            }
            catch {
                res.status(NOT_FOUND).send(); // couldn't find matching file, and the folder contains json files that cannot be parsed
            }

        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
};

// tslint:disable-next-line:cyclomatic-complexity
const findMatchingFile = (filePath: string, fileNames: string[], expectedFileName: string): string => {
    let errorsCaught = 0;
    for (const fileName of fileNames) {
        if (isFileExtensionJson(fileName)) {
            try {
                const data = fs.readFileSync(`${filePath}/${fileName}`, 'utf-8');
                if (JSON.parse(data)['@id'].toString() === expectedFileName) {
                    return data;
                }
            }
            catch {
                errorsCaught ++; // swallow error and continue the loop
            }
        }
    }
    if (errorsCaught > 0) {
        throw new Error();
    }
    return null;
};

const isFileExtensionJson = (fileName: string) => {
    const i = fileName.lastIndexOf('.');
    return i > 0 && fileName.substr(i) === '.json';
};

const dataPlaneUri = '/api/DataPlane';
export const handleDataPlanePostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }
        else {
            request(
                generateDataPlaneRequestBody(req),
                (err, httpRes, body) => {
                    generateDataPlaneResponse(httpRes, body, res);
                }
            );
        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
};

const cloudToDeviceUri = '/api/CloudToDevice';
export const handleCloudToDevicePostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }
        else {
            const hubClient = HubClient.fromConnectionString(req.body.connectionString);
            hubClient.open(() => {
                const message = new CloudToDeviceMessage(req.body.body);
                addPropertiesToCloudToDeviceMessage(message, req.body.properties);
                hubClient.send(req.body.deviceId, message,  (err, result) => {
                    if (err) {
                        res.status(SERVER_ERROR).send(err);
                    } else {
                        res.status(SUCCESS).send(result);
                    }
                    hubClient.close();
                });
            });
        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
};

const eventHubMonitorUri = '/api/EventHub/monitor';
export const handleEventHubMonitorPostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }

        if (!eventHubClientStopping) {
            eventHubProvider(res, req.body).then(result => {
                res.status(SUCCESS).send(result);
            });
        } else {
            res.status(CONFLICT).send('Client currently stopping');
        }
    } catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
};

const eventHubStopUri = '/api/EventHub/stop';
export const handleEventHubStopPostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }

        eventHubClientStopping = true;
        stopClient().then(() => {
            eventHubClientStopping = false;
            res.status(SUCCESS).send();
        });
    } catch (error) {
        eventHubClientStopping = false;
        res.status(SERVER_ERROR).send(error);
    }
};

const modelRepoUri = '/api/ModelRepo';
export const handleModelRepoPostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }
        const controllerRequest = req.body;
        request(
        {
            body: controllerRequest.body || null,
            headers: controllerRequest.headers || null,
            method: controllerRequest.method || 'GET',
            uri: controllerRequest.uri
        },
        (err, httpsres, body) => {
            if (!!err) {
                res.status(SERVER_ERROR).send(err);
            } else {
                res.status((httpsres && httpsres.statusCode) || SUCCESS).send((httpsres && httpsres.body) || {}); //tslint:disable-line
            }
        });
    } catch (error) {
        stopReceivers();
        res.status(SERVER_ERROR).send(error);
    }
};

// tslint:disable-next-line:cyclomatic-complexity
export const addPropertiesToCloudToDeviceMessage = (message: CloudToDeviceMessage, properties: Array<{key: string, value: string, isSystemProperty: boolean}>) => {
    if (!properties || properties.length === 0) {
        return;
    }
    for (const property of properties) {
        if (property.isSystemProperty) {
            switch (property.key) {
                case 'ack':
                    message.ack = property.value;
                    break;
                case 'contentType':
                    message.contentType = property.value as any; // tslint:disable-line:no-any
                    break;
                case 'correlationId':
                    message.correlationId = property.value;
                    break;
                case 'contentEncoding':
                    message.contentEncoding = property.value as any; // tslint:disable-line:no-any
                    break;
                case 'expiryTimeUtc':
                    message.expiryTimeUtc = parseInt(property.value); // tslint:disable-line:radix
                    break;
                case 'messageId':
                    message.messageId = property.value;
                    break;
                case 'lockToken':
                    message.lockToken = property.value;
                    break;
                default:
                    message.properties.add(property.key, property.value);
                    break;
            }
        }
        else {
            message.properties.add(property.key, property.value);
        }
    }
};

// tslint:disable-next-line:cyclomatic-complexity
export const eventHubProvider = async (res: any, body: any) =>  { // tslint:disable-line: no-any
    try {
        if (!eventHubClientStopping) {
            if (!client ||
                body.hubConnectionString && body.hubConnectionString !== connectionString  ||
                body.customEventHubConnectionString && body.customEventHubConnectionString !== connectionString)
            {

                client = body.customEventHubConnectionString ?
                    await EventHubClient.createFromConnectionString(body.customEventHubConnectionString) :
                    await EventHubClient.createFromIotHubConnectionString(body.hubConnectionString);

                connectionString = body.customEventHubConnectionString ?
                    body.customEventHubConnectionString :
                    body.hubConnectionString;
            }

            const partitionIds = await client.getPartitionIds();

            const hubInfo = await client.getHubRuntimeInformation();

            const startTime = body.startTime ?
                Date.parse(body.startTime) :
                Date.now();

            if (!partitionIds) {
                res.status(NOT_FOUND).send('Nothing to return');
            }

            return handleMessages(body.deviceId, client, hubInfo, partitionIds, startTime, !!body.fetchSystemProperties, body.consumerGroup);
        } else {
            res.status(CONFLICT).send('Client currently stopping');
        }
    } catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
};

const stopReceivers = async () => {
    return Promise.all(
        receivers.map(receiver => {
            if (receiver && (receiver.isReceiverOpen === undefined || receiver.isReceiverOpen)) {
                return receiver.stop().catch((err: object) => {
                    console.log(`receivers cleanup error: ${err}`); // tslint:disable-line: no-console
                });
            } else {
                return null;
            }
        })
    );
};

export const stopClient = async () => {
    return stopReceivers().then(() => {
        return client && client.close().then(() => {
            client = null;
        }).catch(error => {
            console.log(`client cleanup error: ${error}`); // tslint:disable-line: no-console
            client = null;
        });
    });
};

const handleMessages = async (deviceId: string, eventHubClient: EventHubClient, hubInfo: EventHubRuntimeInformation, partitionIds: string[], startTime: number, fetchSystemProperties: boolean, consumerGroup: string) => {
    const messages: Message[] = []; // tslint:disable-line: no-any
    const onMessage = async (eventData: any) => { // tslint:disable-line: no-any
        if (eventData && eventData.annotations && eventData.annotations[IOTHUB_CONNECTION_DEVICE_ID] === deviceId) {
            const message: Message = {
                body: eventData.body,
                enqueuedTime: eventData.enqueuedTimeUtc,
                properties: eventData.applicationProperties
            };
            if (fetchSystemProperties) {
                message.systemProperties = eventData.annotations;
            }
            messages.push(message);
        }
    };

    partitionIds.forEach(async (partitionId: string) => {
        const receiveOptions =  {
            consumerGroup,
            enableReceiverRuntimeMetric: true,
            eventPosition: EventPosition.fromEnqueuedTime(startTime),
            name: `${hubInfo.path}_${partitionId}`,
        };
        let receiver: ReceiveHandler;
        try {
            receiver = eventHubClient.receive(
                partitionId,
                onMessage,
                (err: object) => {
                    console.log(err); // tslint:disable-line: no-console
                },
                receiveOptions);
            receivers.push(receiver);
            await delay(SERVER_WAIT).then(() => {
                receiver.stop().catch(err => {
                    console.log(`couldn't stop receiver on partition[${partitionId}]: ${err}`); // tslint:disable-line: no-console
                });
            });
        }
        catch (ex) {
            if (receiver) {
                receiver.stop().catch(err => {
                    console.log(`failed to stop receiver: ${err}`); // tslint:disable-line: no-console
                });
            }
            console.log(`receiver fail: ${ex}`); // tslint:disable-line: no-console
        }
    });
    await delay(SERVER_WAIT).then(() => {
        stopReceivers();
    });

    return messages;
};
