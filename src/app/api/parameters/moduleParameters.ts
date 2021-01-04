/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { InvokeModuleMethodActionParameters } from '../../devices/module/moduleDirectMethod/actions';
import { ModuleIdentity } from '../models/moduleIdentity';

export interface FetchModuleIdentitiesParameters {
    deviceId: string;
}

export interface AddModuleIdentityParameters {
    moduleIdentity: ModuleIdentity;
}

export interface ModuleIdentityTwinParameters {
    deviceId: string;
    moduleId: string;
}

export interface FetchModuleIdentityParameters {
    deviceId: string;
    moduleId: string;
}

export type InvokeModuleMethodParameters = InvokeModuleMethodActionParameters;
