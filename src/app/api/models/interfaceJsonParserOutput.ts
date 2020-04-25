/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ParsedJsonSchema {
    required: string[];

    additionalProperties?: boolean; // use this props as a workaround to indicate whether parsed property is map type
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
    type?: string;
    $ref?: any; // tslint:disable-line: no-any
}

export interface ParsedCommandSchema {
    name: string;

    description?: string;
    requestSchema?: ParsedJsonSchema;
    responseSchema?: ParsedJsonSchema;
}
