/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ModelDefinition {
    '@context': string;
    '@id': string;
    '@type': string;
    comment?: string | object;
    contents: Array<PropertyContent | CommandContent | TelemetryContent>;
    description?: string | object;
    displayName?: string | object;
}

export interface PropertyContent extends ContentBase {
    schema: string | EnumSchema | ObjectSchema | MapSchema;
    writable?: boolean;
}

export interface CommandContent extends ContentBase{
    commandType?: string;
    response?: Schema;
    request?: Schema;
}

export interface TelemetryContent extends ContentBase{
    schema: string | EnumSchema | ObjectSchema | MapSchema;
}

interface ContentBase {
    '@type': string | string[];
    name: string;

    comment?: string | object;
    description?: string | object;
    displayName?: string | object;
    displayUnit?: string;
    unit?: any; // tslint:disable-line:no-any
}

export interface Schema {
    name: string;
    schema: string | EnumSchema | ObjectSchema | MapSchema;
    displayName?: string | object;
    description?: string | object;
}

export interface EnumSchema {
    '@type': string;
    enumValues: Array<{ displayName: string, name: string, enumValue: number}>;
}

export interface ObjectSchema {
    '@type': string;
    fields: Schema[];
}

export interface MapSchema {
    '@type': string;
    mapKey: Schema;
    mapValue: Schema;
}

export enum ContentType{
    Command = 'command',
    Property = 'property',
    Telemetry = 'telemetry'
}
