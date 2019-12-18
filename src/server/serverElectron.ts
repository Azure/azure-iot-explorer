/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { dataPlaneUri,
    handleDataPlanePostRequest,
    cloudToDeviceUri,
    handleCloudToDevicePostRequest,
    eventHubMonitorUri,
    handleEventHubMonitorPostRequest,
    eventHubStopUri,
    handleEventHubStopPostRequest,
    modelRepoUri,
    handleModelRepoPostRequest
} from './serverHelper';

const SERVER_PORT = 8081;
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

app.listen(SERVER_PORT);
