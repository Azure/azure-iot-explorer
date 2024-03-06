/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModuleIdentity } from '../models/moduleIdentity';
import { ModuleTwin } from '../models/moduleTwin';

//#region module identity  CRUD
export interface FetchModuleIdentityParameters {
    connectionString: string;
    deviceId: string;
    moduleId: string;
}

export interface FetchModuleIdentitiesParameters {
    connectionString: string;
    deviceId: string;
}

export interface AddModuleIdentityParameters {
    connectionString: string;
    moduleIdentity: ModuleIdentity;
}

export interface DeleteModuleIdentityParameters {
    connectionString: string;
    deviceId: string;
    moduleId: string;
}
//#endregion

//#region module identity twin
export interface ModuleIdentityTwinParameters {
    connectionString: string;
    deviceId: string;
    moduleId: string;
}

export interface UpdateModuleIdentityTwinParameters {
    connectionString: string;
    moduleTwin: ModuleTwin;
}
//#endregion

export interface InvokeModuleMethodParameters {
    connectionString: string;
    connectTimeoutInSeconds: number;
    deviceId: string;
    methodName: string;
    moduleId: string;
    payload?: any; // tslint:disable-line:no-any
    responseTimeoutInSeconds: number;
}
