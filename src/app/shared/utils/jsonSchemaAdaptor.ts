/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Validator, ValidatorResult, ValidationError } from 'jsonschema';
import { PropertyContent, CommandContent, EnumSchema, MapSchema, ObjectSchema, ContentType, TelemetryContent, ModelDefinition, ComponentContent, ArraySchema, ComplexSchema } from '../../api/models/modelDefinition';
import { ParsedCommandSchema, ParsedJsonSchema } from '../../api/models/interfaceJsonParserOutput';
import { InterfaceSchemaNotSupportedException } from './exceptions/interfaceSchemaNotSupportedException';

export const getSchemaValidationErrors = (data: any, schema: ParsedJsonSchema): ValidationError[] => { // tslint:disable-line: no-any
    const validator = new Validator();
    let result: ValidatorResult;

    try {
        result = validator.validate(data, schema);
        return result?.errors || [];
    }
    catch {
        return [];
    }
};

export const getSchemaType = (schema: any): string => { // tslint:disable-line: no-any
    return typeof schema === 'string' ?
        schema :
        typeof schema['@type'] === 'string' ? schema['@type'] : '--';
};

export const isSchemaSimpleType = (schema: any, ref: string): boolean => { // tslint:disable-line: no-any
    if (ref) {
        return false;
    }
    return schema &&
        (typeof schema === 'string' ||
        typeof schema['@type'] === 'string' && schema['@type'].toLowerCase() === 'enum');
};

export enum DtdlSchemaComplexType {
    Array = 'Array',
    Enum = 'Enum',
    Map = 'Map',
    Object = 'Object'
}

export interface JsonSchemaAdaptorInterface {
    getComponentNameToModelIdMapping: () => ComponentToModelId[];
    getWritableProperties: () => PropertyContent[];
    getNonWritableProperties: () => PropertyContent[];
    getCommands: () => CommandContent[];
    getTelemetry: () => TelemetryContent[];
    parseInterfacePropertyToJsonSchema: (property: PropertyContent) => ParsedJsonSchema;
    parseInterfaceCommandToJsonSchema: (command: CommandContent) => ParsedCommandSchema;
    parseInterfaceTelemetryToJsonSchema: (telemetry: TelemetryContent) => ParsedJsonSchema;
}

export interface ComponentToModelId {
    componentName: string;
    modelId: string;
}

export class JsonSchemaAdaptor implements JsonSchemaAdaptorInterface{
    private readonly model: ModelDefinition;
    private readonly definitions: any; // tslint:disable-line: no-any

    // tslint:disable-next-line: cyclomatic-complexity
    constructor(model: ModelDefinition) {
        // preprocess model to flatten if content is within schema
        if (model && !model.contents && model.schema) {
            this.model = JSON.parse(JSON.stringify(model)); // important: needs this deep copy to prevent model got changed
            this.model.contents = model.schema.contents;
        }
        else {
            this.model = model;
        }
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

    public getComponentNameToModelIdMapping = (): ComponentToModelId[] => {
        const componentContents = this.getModelContents().filter((item: ComponentContent) => this.filterComponent(item)) as ComponentContent[];
        return componentContents && componentContents.map(componentContent => ({
            componentName: componentContent.name,
            modelId: typeof componentContent.schema === 'string' ? componentContent.schema : `${this.model['@id']}/${componentContent.schema['@id']}`
        })) || [];
    }

    public getWritableProperties = () => {
        const filterWritableProperties = (content: PropertyContent) =>  {
            if (typeof content['@type'] === 'string') {
                return content['@type'].toLowerCase() === ContentType.Property && content.writable === true;
            }
            else {
                return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Property) && content.writable === true;
            }
        };
        return this.getModelContents().filter((item: PropertyContent) => filterWritableProperties(item)) as PropertyContent[] || [];
    }

    public getNonWritableProperties = () => {
        const filterNonWritableProperties = (content: PropertyContent) =>  {
            if (typeof content['@type'] === 'string') {
                return content['@type'].toLowerCase() === ContentType.Property && !content.writable;
            }
            else {
                return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Property) && !content.writable;
            }
        };
        return this.getModelContents().filter((item: PropertyContent) => filterNonWritableProperties(item)) as PropertyContent[] || [];
    }

    public getCommands = () => {
        return this.getModelContents().filter((item: CommandContent) => this.filterCommand(item)) as CommandContent[] || [];
    }

    public getTelemetry = () => {
        return this.getModelContents().filter((item: TelemetryContent) => this.filterTelemetry(item)) as TelemetryContent[] || [];
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

    private readonly getModelContents = () => {
        if (this.model && this.model.contents) {
            return Array.isArray(this.model.contents) ? this.model.contents : [this.model.contents];
        }
        else {
            return [];
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
    private readonly parseInterfaceContentSchemaHelper = (propertySchema: string | ComplexSchema): ParsedJsonSchema  => {
        if (typeof(propertySchema) === 'string') {
            if (propertySchema.startsWith('dtmi')) {
                if (Object.keys(this.definitions).includes(propertySchema)) {
                    return {
                        $ref: `#/definitions/${propertySchema}`,
                        required: []
                    };
                }
                else {
                    throw new InterfaceSchemaNotSupportedException();
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
                            format: 'date-time',
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
                    case 'time':
                        return {
                            pattern: '^([\\d]{2}:){2}[\\d]{2}(.[\\d]+)?(Z)?([+|-][\\d]{2}:[\\d]{2})?$', // time regex in ISO 8601
                            required: [],
                            type: 'string',
                        };
                    case 'duration':
                        return {
                            pattern: '^(-?)P(?=\\d|T\\d)(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)([DW]))?(?:T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+(?:\\.\\d+)?)S)?)?$', // duration regex in ISO 8601
                            required: [],
                            type: 'string',
                        };
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

        if (propertySchema['@type'] === DtdlSchemaComplexType.Enum) {
            return propertySchema && (propertySchema as EnumSchema).enumValues ? {
                enum: (propertySchema as EnumSchema).enumValues.map(item => item.enumValue),
                // tslint:disable-next-line:no-any
                enumNames : (propertySchema as EnumSchema).enumValues.map(item => (typeof(item.displayName) !== 'string' && item.displayName as any)?.en || item.displayName || item.name),
                required: [],
                type: (propertySchema as EnumSchema).enumValues.some(item => typeof item.enumValue === 'string') ? 'string' : 'number',
            } : undefined;
        }

        if (propertySchema['@type'] === DtdlSchemaComplexType.Object) {
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

        if (propertySchema['@type'] === DtdlSchemaComplexType.Map) {
            if (!(propertySchema as MapSchema).mapKey || !(propertySchema as MapSchema).mapValue) {
                return;
            }
            return {
                additionalProperties: this.parseInterfaceContentSchemaHelper((propertySchema as MapSchema).mapValue.schema),
                description: `key's name: ${(propertySchema as MapSchema).mapKey.name}, value's name: ${(propertySchema as MapSchema).mapValue.name}`,
                type: 'object'
            };
        }

        if (propertySchema['@type'] === DtdlSchemaComplexType.Array) {
            if (!(propertySchema as ArraySchema).elementSchema) {
                return;
            }
            return {
                items: this.parseInterfaceContentSchemaHelper((propertySchema as ArraySchema).elementSchema),
                required: [],
                type: 'array'
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
}
