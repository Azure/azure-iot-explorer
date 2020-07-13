/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { PropertyContent, CommandContent, EnumSchema, MapSchema, ObjectSchema, ContentType, TelemetryContent, ModelDefinition, ComponentContent } from '../../api/models/modelDefinition';
import { ParsedCommandSchema, ParsedJsonSchema } from '../../api/models/interfaceJsonParserOutput';
import { InterfaceSchemaNotSupportedException } from './exceptions/interfaceSchemaNotSupportedException';

export interface JsonSchemaAdaptorInterface {
    getComponentNameAndInterfaceIdArray: () => ComponentAndInterfaceId[];
    getWritableProperties: () => PropertyContent[];
    getNonWritableProperties: () => PropertyContent[];
    getCommands: () => CommandContent[];
    getTelemetry: () => TelemetryContent[];
    parseInterfacePropertyToJsonSchema: (property: PropertyContent) => ParsedJsonSchema;
    parseInterfaceCommandToJsonSchema: (command: CommandContent) => ParsedCommandSchema;
    parseInterfaceTelemetryToJsonSchema: (telemetry: TelemetryContent) => ParsedJsonSchema;
}

export interface ComponentAndInterfaceId {
    componentName: string;
    interfaceId: string;
}

export class JsonSchemaAdaptor implements JsonSchemaAdaptorInterface{
    private readonly model: ModelDefinition;
    private readonly definitions: any; // tslint:disable-line: no-any

    constructor(model: ModelDefinition) {
        this.model = model;
        const reusableSchema = model && model.schemas || [];
        this.definitions = {} as any; // tslint:disable-line: no-any
        reusableSchema.forEach(schema => {
            try {
                const parsedReusableSchema = this.parseInterfaceContentSchemaHelper(schema);
                this.definitions[schema['@id']] = parsedReusableSchema;
            }
            catch {
                this.definitions[schema['@id']] = {};
            }
        });
    }

    public getComponentNameAndInterfaceIdArray = (): ComponentAndInterfaceId[] => {
        const componentContents = this.model && this.model.contents && this.model.contents.filter((item: ComponentContent) => this.filterComponent(item)) as ComponentContent[];
        return componentContents && componentContents.map(componentContent => ({
            componentName: componentContent.name,
            interfaceId: componentContent.schema
        })) || [];
    }

    public getWritableProperties = () => {
        const filterWritablePropeties = (content: PropertyContent) =>  {
                if (typeof content['@type'] === 'string') {
                return content['@type'].toLowerCase() === ContentType.Property && content.writable === true;
            }
            else {
                return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Property) && content.writable === true;
            }
        };
        return this.model && this.model.contents && this.model.contents.filter((item: PropertyContent) => filterWritablePropeties(item)) as PropertyContent[] || [];
    }

    public getNonWritableProperties = () => {
        const filterNonWritablePropeties = (content: PropertyContent) =>  {
            if (typeof content['@type'] === 'string') {
            return content['@type'].toLowerCase() === ContentType.Property && !content.writable;
        }
        else {
            return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Property) && !content.writable;
        }
    };
        return this.model && this.model.contents && this.model.contents.filter((item: PropertyContent) => filterNonWritablePropeties(item)) as PropertyContent[] || [];
    }

    public getCommands = () => {
        return this.model && this.model.contents && this.model.contents.filter((item: CommandContent) => this.filterCommand(item)) as CommandContent[] || [];
    }

    public getTelemetry = () => {
        return this.model && this.model.contents && this.model.contents.filter((item: TelemetryContent) => this.filterTelemetry(item)) as TelemetryContent[] || [];
    }

    public parseInterfacePropertyToJsonSchema = (property: PropertyContent): ParsedJsonSchema => {
        try {
            return {
                ...this.parseInterfaceContentHelper(property),
                definitions: this.definitions
            };
        } catch {
            return; // swallow the error and let UI render JSON editor for types which are not supported yet
        }
    }

    public parseInterfaceCommandToJsonSchema = (command: CommandContent): ParsedCommandSchema => {
        try {
            return {
                name: command.name,
                requestSchema: this.parseInterfaceCommandsHelper(command, true),
                responseSchema: this.parseInterfaceCommandsHelper(command, false)
            };
        } catch {
            return; // swallow the error and let UI render JSON editor for types which are not supported yet
        }
    }

    public parseInterfaceTelemetryToJsonSchema = (telemetry: TelemetryContent): ParsedJsonSchema => {
        try {
            return {
                ...this.parseInterfaceContentHelper(telemetry),
                definitions: this.definitions
            };
        } catch {
            return; // swallow the error and let UI render JSON editor for types which are not supported yet
        }
    }

    private readonly filterCommand = (content: CommandContent) => {
        if (typeof content['@type'] === 'string') {
            return content['@type'].toLowerCase() === ContentType.Command;
        }
        else {
            return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Command);
        }
    }

    private readonly filterTelemetry = (content: TelemetryContent) => {
        if (typeof content['@type'] === 'string') {
            return content['@type'].toLowerCase() === ContentType.Telemetry;
        }
        else {
            return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Telemetry);
        }
    }

    private readonly parseInterfaceContentHelper = (property:  PropertyContent): ParsedJsonSchema  => {
        if (!property || !property.schema) { return; }

        const parsedSchema = this.parseInterfaceContentSchemaHelper(property.schema);
        return {
            ...parsedSchema,
            title: property.name
        };
    }

    private readonly filterComponent = (content: ComponentContent) => {
        if (typeof content['@type'] === 'string') {
            return content['@type'].toLowerCase() === ContentType.Component;
        }
        else {
            return false;
        }
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private readonly parseInterfaceContentSchemaHelper = (propertySchema: string | EnumSchema | ObjectSchema | MapSchema): ParsedJsonSchema  => {
        if (typeof(propertySchema) === 'string') {
            if (propertySchema.startsWith('dtmi')) {
                if (Object.keys(this.definitions).includes(propertySchema)) {
                    return {
                        $ref: `#/definitions/${propertySchema}`,
                        required: []
                    };
                }
                else {
                    return {
                        required: [],
                        type: 'string'
                    };
                }
            }
            else {
                switch (propertySchema.toLowerCase()) {
                    case 'boolean':
                        return {
                            default: false,
                            required: [],
                            type: 'boolean'
                        };
                    case 'date':
                        return {
                            format: 'date',
                            required: [],
                            type: 'string',
                        };
                    case 'datetime':
                        return {
                            pattern: '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$', // regex for ISO 8601
                            required: [],
                            type: 'string',
                        };
                    case 'double':
                    case 'float':
                    case 'long':
                        return {
                            required: [],
                            type:  ['number', 'null']
                        };
                    case 'integer':
                        return {
                            required: [],
                            type: ['integer', 'null']
                        };
                    case 'time': // todo: no widget for 'time' type
                    case 'duration': // todo: no widget for 'duration' type
                    case 'string':
                        return {
                            required: [],
                            type: 'string'
                        };
                    default:
                        throw new InterfaceSchemaNotSupportedException();
                }
            }
        }

        if (propertySchema['@type'] === 'Enum') {
            return propertySchema && (propertySchema as EnumSchema).enumValues ? {
                enum: (propertySchema as EnumSchema).enumValues.map(item => item.enumValue),
                enumNames : (propertySchema as EnumSchema).enumValues.map(item => item.name),
                required: [],
                type: (propertySchema as EnumSchema).enumValues.some(item => typeof item.enumValue === 'string') ? 'string' : 'number',
            } : undefined;
        }

        if (propertySchema['@type'] === 'Object') {
            if (!(propertySchema as ObjectSchema).fields) {
                return;
            }
            const children: any = {}; // tslint:disable-line: no-any
            (propertySchema as ObjectSchema).fields.forEach(element => {
                const child = this.parseInterfaceContentHelper({...element, '@type': null});
                if (child) {
                    const propertyName = child.title;
                    children[propertyName] = child;
                }
            });

            return  {
                properties: children,
                required: [],
                type: 'object'
            };
        }

        if (propertySchema['@type'] === 'Map') {
            if (!(propertySchema as MapSchema).mapKey || !(propertySchema as MapSchema).mapValue) {
                return;
            }
            return {
                additionalProperties: true,
                items: this.parseInterfaceMapTypePropertyItems(propertySchema),
                required: [],
                type: 'array' // there is no map type in json schema, instead we use an array of object type to present it
            };
        }

        return {
            required: [] // for unsupported complex type, we return a schema that matches to anything for now
        };
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly parseInterfaceCommandsHelper = (command: CommandContent, parseRequestSchema: boolean): ParsedJsonSchema => {
        const commandSchema = parseRequestSchema ? command.request : command.response;

        if (!commandSchema) { return; }

        // add a dummy head for command request/response schema to make the recursion logic simpler
        const dummyCommand: PropertyContent = {
            '@type': ContentType.Command,
            'name': commandSchema.name,
            'schema': commandSchema.schema,
        };

        if (!dummyCommand || !dummyCommand.schema) { return; }
        try {
            return {
                ...this.parseInterfaceContentHelper(dummyCommand),
                definitions: this.definitions
            };
        }
        catch {
            return;  // swallow the error and let UI render JSON editor for types which are not supported yet
        }
    }

    private readonly parseInterfaceMapTypePropertyItems = (propertySchema: string | EnumSchema | ObjectSchema | MapSchema): ParsedJsonSchema => {
        const parsedMapValue = this.parseInterfaceContentHelper({...(propertySchema as MapSchema).mapValue, '@type': null});
        // there is no map type in json schema, instead we use an object type to present every single key value pair
        const items = {
            description: '',
            properties: {} as any, // tslint:disable-line: no-any
            required: [] as string[],
            type: 'object'
        };
        // make mapKey as the first property of the object type, which is always a string
        items.properties[(propertySchema as MapSchema).mapKey.name] = {
            type: 'string'
        };
        // make mapValue as the second property of the object type
        items.properties[(propertySchema as MapSchema).mapValue.name] = parsedMapValue;
        items.required.push(...[(propertySchema as MapSchema).mapKey.name, (propertySchema as MapSchema).mapValue.name]);
        items.description = `Key of the map is: ${(propertySchema as MapSchema).mapKey.name}`;
        return items;
    }
}
