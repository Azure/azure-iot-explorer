/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { PropertyContent, CommandContent, EnumSchema, ObjectSchema, MapSchema, ContentType, TelemetryContent, Schema } from '../../api/models/modelDefinition';
import { ParsedCommandSchema, ParsedJsonSchema } from '../../api/models/interfaceJsonParserOutput';
import { InterfaceSchemaNotSupportedException } from './exceptions/interfaceSchemaNotSupportedException';
import { getLocalizedData } from '../../api/dataTransforms/modelDefinitionTransform';

export const parseInterfacePropertyToJsonSchema = (property: PropertyContent): ParsedJsonSchema => {
    try {
        return parseInterfacePropertyHelper(property);
    } catch {
        return; // swallow the error and let UI render JSON editor for types which are not supported yet
    }
};

export const parseInterfaceCommandToJsonSchema = (command: CommandContent): ParsedCommandSchema => {
    try {
        return {
            description: getDescription(command),
            name: command.name,
            requestSchema: parseInterfaceCommandsHelper(command, true),
            responseSchema: parseInterfaceCommandsHelper(command, false)
        };
    } catch {
        return; // swallow the error and let UI render JSON editor for types which are not supported yet
    }
};

export const parseInterfaceTelemetryToJsonSchema = (telemetry: TelemetryContent): ParsedJsonSchema => {
    try {
        return parseInterfacePropertyHelper(telemetry);
    } catch {
        return; // swallow the error and let UI render JSON editor for types which are not supported yet
    }
};

// tslint:disable-next-line:cyclomatic-complexity
const parseInterfacePropertyHelper = (property:  PropertyContent): ParsedJsonSchema  => {
    if (!property || !property.schema) { return; }

    if (typeof(property.schema) === 'string') {
        switch (property.schema.toLowerCase()) {
            case 'boolean':
                return {
                    default: false,
                    description: getDescription(property),
                    title: property.name,
                    type: 'boolean'
                };
            case 'date':
                return {
                    description: getDescription(property),
                    format: 'date',
                    title: property.name,
                    type: 'string',
                };
            case 'datetime':
                return {
                    description: getDescription(property),
                    pattern: '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$', // regex for ISO 8601
                    title: property.name,
                    type: 'string',
                };
            case 'double':
            case 'float':
            case 'long':
                return {
                    description: getDescription(property),
                    title: property.name,
                    type: 'number',
                };
            case 'integer':
                return {
                    default: 0,
                    description: getDescription(property),
                    title: property.name,
                    type: 'integer',
                };
            case 'time': // todo: no widget for 'time' type
            case 'duration': // todo: no widget for 'duration' type
            case 'string':
                return {
                    description: getDescription(property),
                    title: property.name,
                    type: 'string'
                };
            default:
                throw new InterfaceSchemaNotSupportedException();
        }
    }

    if (property.schema['@type'] === 'Enum') {
        return property.schema && (property.schema as EnumSchema).enumValues ? {
            description: getDescription(property),
            enum: (property.schema as EnumSchema).enumValues.map(item => item.enumValue),
            enumNames : (property.schema as EnumSchema).enumValues.map(item => item.name),
            title: property.name,
            type: (property.schema as EnumSchema).enumValues.some(item => typeof item.enumValue === 'string') ? 'string' : 'number',
        } : undefined;
    }

    if (property.schema['@type'] === 'Object') {
        if (!(property.schema as ObjectSchema).fields) {
            return;
        }
        const children: any = {}; // tslint:disable-line: no-any
        (property.schema as ObjectSchema).fields.forEach(element => {
            const child = parseInterfacePropertyHelper({...element, '@type': null});
            if (child) {
                const propertyName = child.title;
                children[propertyName] = child;
            }
        });

        return  {
            description: getDescription(property),
            properties: children,
            title: property.name,
            type: 'object'
        };
    }

    if (property.schema['@type'] === 'Map') {
        if (!(property.schema as MapSchema).mapKey || !(property.schema as MapSchema).mapValue) {
            return;
        }
        return {
            additionalProperties: true,
            description: getDescription(property),
            items: parseInterfaceMapTypePropertyItems(property),
            title: property.name,
            type: 'array' // there is no map type in json schema, instead we use an array of object type to present it
        };
    }

    return {
        description: getDescription(property),
        title: property.name,
        type: 'string'
    };
};

const parseInterfaceMapTypePropertyItems = (property: PropertyContent): ParsedJsonSchema => {
    const parsedMapValue = parseInterfacePropertyHelper({...(property.schema as MapSchema).mapValue, '@type': null});

    // there is no map type in json schema, instead we use an object type to present every single key value pair
    const items = {
        description: '',
        properties: {} as any, // tslint:disable-line: no-any
        required: [] as string[],
        type: 'object'
    };
    // make mapKey as the first property of the object type, which is always a string
    items.properties[(property.schema as MapSchema).mapKey.name] = {
        type: 'string'
    };
    // make mapValue as the second property of the object type
    items.properties[(property.schema as MapSchema).mapValue.name] = parsedMapValue;
    items.required.push(...[(property.schema as MapSchema).mapKey.name, (property.schema as MapSchema).mapValue.name]);
    items.description = `${property.name}'s key: ${(property.schema as MapSchema).mapKey.name}`;
    return items;
};

// tslint:disable-next-line:cyclomatic-complexity
const parseInterfaceCommandsHelper = (command: CommandContent, parseRequestSchema: boolean): ParsedJsonSchema => {
    const commandSchema = parseRequestSchema ? command.request : command.response;

    if (!commandSchema) { return; }

    // add a dummy head for command request/response schema to make the recursion logic simpler
    const dummyCommand: PropertyContent = {
        '@type': ContentType.Command,
        'displayName': getDescription(commandSchema),
        'name': commandSchema.name,
        'schema': commandSchema.schema,
    };

    if (!dummyCommand || !dummyCommand.schema) { return; }
    try {
        return parseInterfacePropertyHelper(dummyCommand);
    }
    catch {
        return;  // swallow the error and let UI render JSON editor for types which are not supported yet
    }
};

const getDescription = (schema: PropertyContent | CommandContent | Schema): string => {
    const displayName = getLocalizedData(schema.displayName);
    const description = getLocalizedData(schema.description);
    return displayName && description ?
    `${displayName} / ${description}` :
     (description || displayName || '') as string;
};
