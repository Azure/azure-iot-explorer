/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ServerBase } from './serverBase';

const SERVER_PORT = 8082;
(new ServerBase(SERVER_PORT)).init();
