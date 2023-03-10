/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ParsedJsonSchema {
    required?: string[];

    additionalProperties?: ParsedJsonSchema;
    default?: {};
    definitions?: any; // tslint:disable-line: no-any
    description?: string;
    enum?: Array<number | string>;
    enumNames?: string[];
    format?: string;
    items?: any; // tslint:disable-line: no-any
    pattern?: string;
    properties?: {};
    title?: string;
    type?: string | string[];
    $ref?: string;
}

export interface ParsedCommandSchema {
    name: string;

    description?: string;
    requestSchema?: ParsedJsonSchema;
    responseSchema?: ParsedJsonSchema;
}
