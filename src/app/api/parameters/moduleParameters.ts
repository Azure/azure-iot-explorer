/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModuleIdentity } from '../models/moduleIdentity';
import { DataPlaneParameters } from './deviceParameters';

export interface FetchModuleIdentitiesParameters extends DataPlaneParameters {
    deviceId: string;
}

export interface AddModuleIdentityParameters extends DataPlaneParameters {
    moduleIdentity: ModuleIdentity;
}

export interface ModuleIdentityTwinParameters extends DataPlaneParameters {
    deviceId: string;
    moduleId: string;
}

export interface FetchModuleIdentityParameters extends DataPlaneParameters {
    deviceId: string;
    moduleId: string;
}
