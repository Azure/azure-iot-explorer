/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ModelDefinition {
    '@context': string;
    '@id': string;
    '@type': string;
    comment?: string | object;
    contents: Array<PropertyContent | CommandContent | TelemetryContent | ComponentContent>;
    description?: string | object;
    displayName?: string | object;
    schemas?: Array<ObjectSchema | MapSchema | EnumSchema>;
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

export interface ComponentContent extends ContentBase{
    schema: string;
}

interface ContentBase {
    '@type': string | string[];
    name: string;

    comment?: string | object;
    description?: string | object;
    displayName?: string | object;
    unit?: string;
}

export interface Schema {
    name: string;
    schema: string | EnumSchema | ObjectSchema | MapSchema;
    displayName?: string | object;
    description?: string | object;
}

interface EnumValue {
    displayName: string | object;
    name: string;
    enumValue: number | string;
}

export interface EnumSchema {
    '@type': string;
    valueSchema: string;
    enumValues: EnumValue[];
    '@id'?: string;
}

export interface ObjectSchema {
    '@type': string;
    fields: Schema[];
    '@id'?: string;
}

export interface MapSchema {
    '@type': string;
    mapKey: Schema;
    mapValue: Schema;
    '@id'?: string;
}

export enum ContentType{
    Command = 'command',
    Property = 'property',
    Telemetry = 'telemetry',
    Component = 'component'
}
