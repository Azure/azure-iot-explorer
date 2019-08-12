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
    capabilityModelId = 'dcm',
    interfaceId = 'interface',
//    propertyValue = 'properties.reported',
    status = 'status',
//    lastActivityTime = 'lastActivityTime',
//    statusUpdateTime = 'statusUpdateTime'
}

export enum OperationType {
    equals = '=',
    notEquals = '!=',
    // lessThan = '<',
    // lessThanEquals = '<=',
    // greaterThan = '>',
    // greaterThanEquals = '>=',
    // inequal = '<>'
}
