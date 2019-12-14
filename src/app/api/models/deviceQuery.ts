/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export default interface DeviceQuery {
    deviceId: string;
    clauses: QueryClause[];
    continuationTokens: string[];
    currentPageIndex: number;
}

export interface QueryClause {
    parameterType?: ParameterType;
    operation?: OperationType;
    value?: string;
    isError?: boolean;
}

export enum ParameterType {
    // non pnp
    edge = 'capabilities.iotEdge',
    status = 'status',
    // pnp
    capabilityModelId = 'dcm',
    interfaceId = 'interface',
}

export enum OperationType {
    equal = '=',
    notEqual = '!=',
}

export enum DeviceCapability {
    edge = 'true',
    nonEdge = 'false'
}

export enum DeviceStatus {
    enabled = 'enabled',
    disabled = 'disabled'
}
