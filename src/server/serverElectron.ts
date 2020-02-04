/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import ServerBase from './serverBase';

const SERVER_PORT = 8081;
// try to read from environment variable to check if the users have set up a specific port to use
try {
    const customPort = parseInt(process.env.AZURE_IOT_EXPLORER_PORT); // tslint:disable-line:radix
    (new ServerBase(customPort || SERVER_PORT)).init();
}
catch {
    (new ServerBase(SERVER_PORT)).init();
}
