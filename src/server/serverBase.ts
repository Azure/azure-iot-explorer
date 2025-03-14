/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
// this file is the legacy controller for local development, until we move server side code to use electron's IPC pattern and enable electron hot reloading
import * as fs from 'fs';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import fetch from 'node-fetch';
import * as he from 'he';
import { EventHubConsumerClient, Subscription, ReceivedEventData, earliestEventPosition } from '@azure/event-hubs';
import { generateDataPlaneRequestBody, generateDataPlaneResponse } from './dataPlaneHelper';
import { convertIotHubToEventHubsConnectionString } from './eventHubHelper';
import { checkPath, fetchDirectories, findMatchingFile, readFileFromLocal, SAFE_ROOT } from './utils';

export const SERVER_ERROR = 500;
export const SUCCESS = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const NO_CONTENT_SUCCESS = 204;

let messages: Message[] = [];
let wss: WebSocket.Server;
let ws: WebSocket.WebSocket;
let timerId: NodeJS.Timer;

interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    sequenceNumber: number;
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
        app.post(eventHubMonitorUri, handleEventHubMonitorPostRequest);
        app.post(eventHubStopUri, handleEventHubStopPostRequest);
        app.get(readFileUri, handleReadFileRequest);
        app.get(readFileNaiveUri, handleReadFileNaiveRequest);
        app.get(getDirectoriesUri, handleGetDirectoriesRequest);

        //initialize a simple http server
        const server = http.createServer(app);

        //start the server
        server.listen(this.port).on('error', () => { throw new Error(
           `Failed to start the app on port ${this.port} as it is in use.
            You can still view static pages, but requests cannot be made to the services if the port is still occupied.
            To get around with the issue, configure a custom port by setting the system environment variable 'AZURE_IOT_EXPLORER_PORT' to an available port number.
            To learn more, please visit https://github.com/Azure/azure-iot-explorer/wiki/FAQ`); });

        //initialize the WebSocket server instance
        wss = new WebSocket.Server({ server });
        wss.on('connection', (_ws: WebSocket) => {
            if (_ws && _ws.readyState === WebSocket.OPEN) {
                ws = _ws;
            }
            else {
                ws = null;
            }
        });
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
            const resolvedPath = checkPath(filePath);
            const fileNames = fs.readdirSync(resolvedPath);
            try {
                const foundContent = findMatchingFile(resolvedPath, fileNames, expectedFileName);
                if (foundContent) {
                    res.status(SUCCESS).send(foundContent);
                }
                else {
                    res.status(NO_CONTENT_SUCCESS).send();
                }
            }
            catch (error) {
                res.status(NOT_FOUND).send('Not able to find any matching file.'); // couldn't find matching file, and the folder contains json files that cannot be parsed
            }

        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error?.message);
    }
};

const readFileNaiveUri = '/api/ReadFileNaive/:path/:file';
export const handleReadFileNaiveRequest = (req: express.Request, res: express.Response) => {
    try {
        const filePath = req.params.path;
        const expectedFileName = req.params.file;
        if (!filePath || !expectedFileName) {
            res.status(BAD_REQUEST).send();
        }
        else {
            const data = readFileFromLocal(filePath, expectedFileName);
            JSON.parse(data); // try parse the data to validate json format
            res.status(SUCCESS).send(data);
        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error?.message);
    }
};

const getDirectoriesUri = '/api/Directories/:path';
export const handleGetDirectoriesRequest = (req: express.Request, res: express.Response) => {
    try {
        const dir = req.params.path;
        if (dir === '$DEFAULT') {
            res.status(SUCCESS).send([SAFE_ROOT]);
        }
        else {
            fetchDirectories(dir, res);
        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error?.message);
    }
};

const dataPlaneUri = '/api/DataPlane';
export const handleDataPlanePostRequest = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }
        else {
            const dataPlaneRequest = generateDataPlaneRequestBody(req);
            const response = fetch(dataPlaneRequest.url, dataPlaneRequest.request);
            await generateDataPlaneResponse(await response, res);
        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error?.message);
    }
};

const eventHubMonitorUri = '/api/EventHub/monitor';
const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
const IOTHUB_CONNECTION_MODULE_ID = 'iothub-connection-module-id';
let client: EventHubConsumerClient = null;
let subscription: Subscription = null;
export const handleEventHubMonitorPostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
            return;
        }
        initializeEventHubClient(req.body).then(() => {
            res.status(SUCCESS).send([]);
        });
    } catch (error) {
        res.status(SERVER_ERROR).send(he.encode(error.toString()));
    }
};

const eventHubStopUri = '/api/EventHub/stop';
export const handleEventHubStopPostRequest = (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
            return;
        }

        stopClient().then(() => {
            res.status(SUCCESS).send();
        });
    } catch (error) {
        res.status(SERVER_ERROR).send(he.encode(error.toString()));
    }
};

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
            },

        },
        {startPosition: earliestEventPosition}
    );

    timerId = setInterval(() => {
        if (ws.readyState === 1) {
            ws?.send(JSON.stringify(messages));
        }
        messages = [];
      },
      800 // send messages to client in a 0.8 sec interval
    );
};

const handleMessages = (events: ReceivedEventData[], params: any) => {
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
                if (messages.find(item => item.sequenceNumber === message.sequenceNumber))
                    return; // do not push message if the same sequence already exist
                messages.push(message);
            }
        }
    });
};

export const stopClient = async () => {
    console.log('stop client');
    if (messages.length >= 1) {
        // send left over messages if any
        ws?.send(JSON.stringify(messages));
        messages = [];
    }
    clearInterval(timerId);
    await subscription?.close();
    await client?.close();
};
