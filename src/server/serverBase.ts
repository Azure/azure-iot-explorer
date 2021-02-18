/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import express = require('express');
import request = require('request');
import bodyParser = require('body-parser');
import cors = require('cors');
import { generateDataPlaneRequestBody, generateDataPlaneResponse } from './dataPlaneHelper';

const SERVER_ERROR = 500;
const BAD_REQUEST = 400;

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

        app.listen(this.port).on('error', () => { throw new Error(
           `Failed to start the app on port ${this.port} as it is in use.
            You can still view static pages, but requests cannot be made to the services if the port is still occupied.
            To get around with the issue, configure a custom port by setting the system environment variable 'AZURE_IOT_EXPLORER_PORT' to an available port number.
            To learn more, please visit https://github.com/Azure/azure-iot-explorer/wiki/FAQ`); });
    }
}

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
