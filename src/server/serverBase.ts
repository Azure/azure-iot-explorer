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
import { EventHubClient, EventPosition, ReceiveHandler } from '@azure/event-hubs';
import { generateDataPlaneRequestBody, generateDataPlaneResponse } from './dataPlaneHelper';

const SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const SUCCESS = 200;
const NOT_FOUND = 404;
const NO_CONTENT_SUCCESS = 204;

interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}

export class ServerBase {
    private readonly port: number;
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
        app.get(getDirectoriesUri, handleGetDirectoriesRequest);

        app.listen(this.port).on('error', () => { throw new Error(
           `Failed to start the app on port ${this.port} as it is in use.
            You can still view static pages, but requests cannot be made to the services if the port is still occupied.
            To get around with the issue, configure a custom port by setting the system environment variable 'AZURE_IOT_EXPLORER_PORT' to an available port number.
            To learn more, please visit https://github.com/Azure/azure-iot-explorer/wiki/FAQ`); });
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
            catch (error) {
                res.status(NOT_FOUND).send(error.message); // couldn't find matching file, and the folder contains json files that cannot be parsed
            }

        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
};

// tslint:disable-next-line:cyclomatic-complexity
export const findMatchingFile = (filePath: string, fileNames: string[], expectedFileName: string): string => {
    const filesWithParsingError = [];
    for (const fileName of fileNames) {
        if (isFileExtensionJson(fileName)) {
            try {
                const data = readFileFromLocal(filePath, fileName);
                const parsedData = JSON.parse(data);
                if (parsedData) {
                    if (Array.isArray(parsedData)) { // if parsedData is array, it is using expanded dtdl format
                        for (const pd of parsedData) {
                            if (pd['@id']?.toString() === expectedFileName) {
                                return pd;
                            }
                        }
                    }
                    else {
                        if (parsedData['@id']?.toString() === expectedFileName) {
                            return data;
                        }
                    }
                }
            }
            catch (error) {
                filesWithParsingError.push(`${fileName}: ${error.message}`); // swallow error and continue the loop
            }
        }
    }
    if (filesWithParsingError.length > 0) {
        throw new Error(filesWithParsingError.join(', '));
    }
    return null;
};

export const readFileFromLocal = (filePath: string, fileName: string) => {
    return fs.readFileSync(`${filePath}/${fileName}`, 'utf-8');
}

const isFileExtensionJson = (fileName: string) => {
    const i = fileName.lastIndexOf('.');
    return i > 0 && fileName.substr(i) === '.json';
};

const getDirectoriesUri = '/api/Directories/:path';
export const handleGetDirectoriesRequest = (req: express.Request, res: express.Response) => {
    try {
        const dir = req.params.path;
        if (dir === '$DEFAULT') {
            fetchDrivesOnWindows(res);
        }
        else {
            fetchDirectories(dir, res);
        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
};

const fetchDrivesOnWindows = (res: express.Response) => {
    const exec = require('child_process').exec;
    exec('wmic logicaldisk get name', (error: any, stdout: any, stderr: any) => { // tslint:disable-line:no-any
        if (!error && !stderr) {
            res.status(SUCCESS).send(stdout);
        }
        else {
            res.status(SERVER_ERROR).send();
        }
    });
};

const fetchDirectories = (dir: string, res: express.Response) => {
    const result: string[] = [];
    for (const item of fs.readdirSync(dir)) {
        try {
            const stat = fs.statSync(path.join(dir, item));
            if (stat.isDirectory()) {
                result.push(item);
            }
        }
        catch {
            // some item cannot be checked by isDirectory(), swallow error and continue the loop
        }
    }
    res.status(SUCCESS).send(result);
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
const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
const IOTHUB_CONNECTION_MODULE_ID = 'iothub-connection-module-id';
let client: EventHubClient = null;
let messages: Message[] = [];
let receivers: ReceiveHandler[] = [];
let connectionString: string = ''; // would equal `${hubConnectionString}` or `${customEventHubConnectionString}/${customEventHubName}`
let deviceId: string = '';
let moduleId: string = '';
export const handleEventHubMonitorPostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }


        eventHubProvider(req.body).then(result => {
            res.status(SUCCESS).send(result);
        });
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

        stopClient();
        res.status(SUCCESS).send();
    } catch (error) {
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

export const eventHubProvider = async (params: any) =>  {
    if (needToCreateNewEventHubClient(params))
    {
        // hub has changed, reinitialize client, receivers and mesages
        client = params.customEventHubConnectionString ?
            await EventHubClient.createFromConnectionString(params.customEventHubConnectionString, params.customEventHubName) :
            await EventHubClient.createFromIotHubConnectionString(params.hubConnectionString);

        connectionString = params.customEventHubConnectionString ?
            `${params.customEventHubConnectionString}/${params.customEventHubName}` :
            params.hubConnectionString;
        receivers = [];
        messages = [];
    }
    updateEntityIdIfNecessary(params);

    return listeningToMessages(client, params);
};

const listeningToMessages = async (eventHubClient: EventHubClient, params: any) => {
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

export const stopClient = async () => {
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

const needToCreateNewEventHubClient = (parmas: any): boolean => {
    return !client ||
        parmas.hubConnectionString && parmas.hubConnectionString !== connectionString  ||
        parmas.customEventHubConnectionString && `${parmas.customEventHubConnectionString}/${parmas.customEventHubName}` !== connectionString;
}

const updateEntityIdIfNecessary = (parmas: any) => {
    if (!deviceId || parmas.deviceId !== deviceId) {
        deviceId = parmas.deviceId;
        messages = [];
    }
    if (parmas.moduleId !== moduleId) {
        moduleId = parmas.moduleId;
        messages = [];
    }
}

const onMessageReceived = async (eventData: any) => {
    if (eventData?.annotations?.[IOTHUB_CONNECTION_DEVICE_ID] === deviceId) {
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
