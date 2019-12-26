/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AuthenticationCredentials } from './deviceIdentity';

export interface ModuleIdentity {
    authentication: AuthenticationCredentials;
    cloudToDeviceMessageCount?: number;
    connectionState?: string;
    connectionStateUpdatedTime?:  string;
    deviceId: string;
    etag?: string;
    generationId?: string;
    lastActivityTime?: string;
    managedBy?: string;
    moduleId: string;
}
