/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface DeviceQuery {
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
    edge = 'capabilities.iotEdge',
    status = 'status',
}

export enum OperationType {
    equals = '=',
    notEquals = '!=',
}

export enum DeviceCapability {
    edge = 'true',
    nonEdge = 'false'
}

export enum DeviceStatus {
    enabled = 'enabled',
    disabled = 'disabled'
}
