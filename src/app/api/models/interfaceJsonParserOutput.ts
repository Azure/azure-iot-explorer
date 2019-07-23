/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ParsedJsonSchema {
    type: string;

    additionalProperties?: boolean; // use this props as a workaround to indicate whether parsed property is map type
    default?: {};
    description?: string;
    enum?: number[] ;
    enumNames?: string[];
    format?: string;
    items?: any; // tslint:disable-line: no-any
    properties?: {};
    required?: string[];
    title?: string;
}

export interface ParsedCommandSchema {
    description: string;
    name: string;
    requestSchema?: ParsedJsonSchema;
    responseSchema?: ParsedJsonSchema;
}
