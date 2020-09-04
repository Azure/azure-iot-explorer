/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export type ComplexSchema = ObjectSchema | MapSchema | EnumSchema | ArraySchema;
export type ContentTypeUnion = PropertyContent | CommandContent | TelemetryContent | ComponentContent;

export interface ModelDefinition {
    '@context': string;
    '@id': string;
    '@type': string;
    comment?: string | object;
    contents?: ContentTypeUnion[];
    description?: string | object;
    displayName?: string | object;
    schemas?: ComplexSchema[];
    schema?: {
        '@type': string;
        '@id': string;
        contents: ContentTypeUnion[];
    };
}

export interface PropertyContent extends ContentBase {
    schema: string | ComplexSchema;
    writable?: boolean;
}

export interface CommandContent extends ContentBase{
    commandType?: string;
    response?: Schema;
    request?: Schema;
}

export interface TelemetryContent extends ContentBase{
    schema: string | ComplexSchema;
}

export interface ComponentContent extends ContentBase{
    schema: string | {
        '@type': string;
        '@id': string;
        contents: ContentTypeUnion[];
    };
}

interface ContentBase {
    '@type': string | string[];
    name: string;

    comment?: string | object;
    description?: string | object;
    displayName?: string | object;
    unit?: string;
    '@id'?: string;
}

export interface Schema {
    name: string;
    schema: string | ComplexSchema;
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

export interface ArraySchema {
    '@type': string;
    elementSchema: string | ComplexSchema;
    '@id'?: string;
}

export enum ContentType{
    Command = 'command',
    Property = 'property',
    Telemetry = 'telemetry',
    Component = 'component'
}
