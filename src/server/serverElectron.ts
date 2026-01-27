/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ServerBase } from './serverBase';

const SERVER_PORT = 8081;

// Export the server instance so electron.ts can access it
export let serverInstance: ServerBase | null = null;

try {
    let customPort = parseInt(process.env.AZURE_IOT_EXPLORER_PORT); // tslint:disable-line:radix
    if (isNaN(customPort)) {
        customPort = SERVER_PORT;
    }
    serverInstance = new ServerBase(customPort || SERVER_PORT);
    serverInstance.init();
}
catch {
    serverInstance = new ServerBase(SERVER_PORT);
    serverInstance.init();
}
