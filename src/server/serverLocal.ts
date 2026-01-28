/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ServerBase } from './serverBase';

const SERVER_PORT = 8082;

// Local development server - security disabled for easier debugging
(new ServerBase(SERVER_PORT, false)).init();
