/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import request = require('request');

import { EventHubClient, EventPosition, delay, EventHubRuntimeInformation, ReceiveHandler } from '@azure/event-hubs';

const API_VERSION = '2018-06-30';
const BAD_REQUEST = 400;
const SUCCESS = 200;
const SERVER_ERROR = 500;
const NOT_FOUND = 400;
const SERVER_PORT = 8081;
const SERVER_WAIT = 3000; // how long we'll let the call for eventHub messages run in non-socket
const app = express();
const DEVICE_STATUS_HEADER = 'x-ms-command-statuscode';
let client: EventHubClient = null;
const receivers: ReceiveHandler[] = []; // tslint:disable-line: no-any
let connectionString: string = '';
let eventHubClientStopping = false;

// should not import from app
const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}

app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:3000',
}));

// tslint:disable-next-line:cyclomatic-complexity
app.post('/api/DataPlane', (req: express.Request, res: express.Response) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }
        else {
            const headers = {
                'Accept': 'application/json',
                'Authorization': req.body.sharedAccessSignature,
                'Content-Type': 'application/json',
                ...req.body.headers
            };
            if (req.body.etag) {
                // tslint:disable-next-line:no-any
                (headers as any)['If-Match'] = `"${req.body.etag}"`;
            }

            const apiVersion = req.body.apiVersion || API_VERSION;
            const queryString = req.body.queryString ? `?${req.body.queryString}&api-version=${apiVersion}` : `?api-version=${apiVersion}`;
            request(
            {
                body: req.body.body,
                headers,
                method: req.body.httpMethod.toUpperCase(),
                uri: `https://${req.body.hostName}/${encodeURIComponent(req.body.path)}${queryString}`,
            },
            (err, httpRes, body) => {
                if (httpRes) {
                    if (httpRes.headers && httpRes.headers[DEVICE_STATUS_HEADER]) { // handles happy failure cases when error code is returned as a header
                        // tslint:disable-next-line:radix
                        res.status(parseInt(httpRes.headers[DEVICE_STATUS_HEADER] as string)).send({body: JSON.parse(body)});
                    }
                    else {
                        res.status(httpRes.statusCode).send({
                            body: JSON.parse(body),
                            headers: httpRes.headers
                        });
                    }
                }
                else {
                    res.send({body: JSON.parse(body)});
                }
            });
        }
    }
    catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
});

app.post('/api/EventHub/monitor', (req, res) => {
    try {
        if (!req.body) {
            res.status(BAD_REQUEST).send();
        }

        if (!eventHubClientStopping) {
            eventHubProvider(res, req.body).then(result => {
                res.status(SUCCESS).send(result);
            });
        } else {
            res.status(NOT_FOUND).send('Client currently stopping');
        }
    } catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
});

app.post('/api/EventHub/stop', (req, res) => {
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
});

app.post('/api/ModelRepo', (req, res) => {
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
        res.status(SERVER_ERROR).send(error);
    }
});

// tslint:disable-next-line: no-any
const eventHubProvider = async (res: any, body: any) =>  {
    try {
        if (!eventHubClientStopping) {
            if (!client || connectionString !== body.connectionString) {
                client = await EventHubClient.createFromIotHubConnectionString(body.connectionString);
                connectionString = body.connectionString;
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
            res.status(NOT_FOUND).send('Client currently stopping');
        }
    } catch (error) {
        res.status(SERVER_ERROR).send(error);
    }
}; // tslint:disable-line:cyclomatic-complexity

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

const stopClient = async () => {
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

app.listen(SERVER_PORT);
