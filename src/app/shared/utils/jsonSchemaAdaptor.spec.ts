/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { mockModelDefinition,
    stringTypeWritableProperty,
    longTypeNonWritableProperty,
    timeTypeCommand,
    mapTypeTelemetry,
    enumbTypeProperty,
    schema,
    commandWithReusableSchemaInline,
    commandWithReusableSchemaNotInline,
    longTypeNonWritableProperty2,
    arrayTypeTelemetry
} from './mockModelDefinition';
import { JsonSchemaAdaptor,
    getSchemaValidationErrors,
    getSchemaType,
    isSchemaSimpleType
} from './jsonSchemaAdaptor';

describe('parse interface model definition to Json schema', () => {
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(mockModelDefinition);

    describe('returns list', () => {
        it('returns a list of writable properties', () => {
            expect(jsonSchemaAdaptor.getWritableProperties()).toEqual([stringTypeWritableProperty]);
        });

        it('returns a list of non-writable properties', () => {
            expect(jsonSchemaAdaptor.getNonWritableProperties()).toEqual([longTypeNonWritableProperty, longTypeNonWritableProperty2]);
        });

        it('returns a list of commands', () => {
            expect(jsonSchemaAdaptor.getCommands()).toEqual([timeTypeCommand]);
        });

        it('returns a list of telemetry', () => {
            expect(jsonSchemaAdaptor.getTelemetry()).toEqual([mapTypeTelemetry, arrayTypeTelemetry]);
        });
    });

    describe('parses simple content', () => {
        it('parses simple property', () => {
            expect(jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(stringTypeWritableProperty)).toEqual(
                {
                    definitions: {},
                    required: [],
                    title: stringTypeWritableProperty.name,
                    type: 'string'
                }
            );
            expect(jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(longTypeNonWritableProperty)).toEqual(
                {
                    definitions: {},
                    required: [],
                    title: longTypeNonWritableProperty.name,
                    type: ['number', 'null']
                }
            );
        });

        it('parses simple command', () => {
            expect(jsonSchemaAdaptor.parseInterfaceCommandToJsonSchema(timeTypeCommand)).toEqual(
                {
                    name: timeTypeCommand.name,
                    requestSchema: {
                        definitions: {},
                        format: 'date-time',
                        required: [],
                        title: timeTypeCommand.request.name,
                        type: 'string',
                    },
                    responseSchema: {
                        definitions: {},
                        pattern: '^(-?)P(?=\\d|T\\d)(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)([DW]))?(?:T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+(?:\\.\\d+)?)S)?)?$',
                        required: [],
                        title: timeTypeCommand.response.name,
                        type: 'string',
                    }
                }
            );
        });
    });

    describe('parses complex content', () => {
        it('parses enum type property', () => {
            expect(jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(enumbTypeProperty)).toEqual(
                {
                    definitions: {},
                    enum: ['1', '2'],
                    enumNames : ['offline', 'online'],
                    required: [],
                    title: enumbTypeProperty.name,
                    type: 'string'
                }
            );
        });

        it('parses map type telemetry', () => {
            expect(jsonSchemaAdaptor.parseInterfaceTelemetryToJsonSchema(mapTypeTelemetry)).toEqual(
                {
                    additionalProperties: true,
                    definitions: {},
                    items: {
                        description: 'Key of the map is: telemetryName',
                        properties: {
                            telemetryConfig: {
                                format: 'date',
                                required: [],
                                title: 'telemetryConfig',
                                type: 'string',
                            },
                            telemetryName: {
                                pattern: '^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$',
                                type: 'string',
                            },
                        },
                        required:  [
                            'telemetryName',
                            'telemetryConfig',
                        ],
                        type: 'object',
                    },
                    required: [],
                    title: mapTypeTelemetry.name,
                    type: 'array'
                }
            );
        });
    });

    it('parses array type telemetry', () => {
        expect(jsonSchemaAdaptor.parseInterfaceTelemetryToJsonSchema(arrayTypeTelemetry)).toEqual(
            {
                definitions: {},
                items: {
                    properties: {
                        dateField: {
                            format: 'date',
                            required: [],
                            title: 'dateField',
                            type: 'string',
                        },
                        stringField: {
                            required: [],
                            title: 'stringField',
                            type: 'string',
                        },
                    },
                    required:  [],
                    type: 'object',
                },
                required: [],
                title: arrayTypeTelemetry.name,
                type: 'array'
            }
        );
    });

    describe('parses content with reusable schema', () => {
        const jsonSchemaAdaptorWithResuableSchema = new JsonSchemaAdaptor({...mockModelDefinition, schemas: schema});
        it('parses command with reusable schema inline', () => {
            expect(jsonSchemaAdaptorWithResuableSchema.parseInterfaceCommandToJsonSchema(commandWithReusableSchemaInline)).toEqual(
                {
                    name: commandWithReusableSchemaInline.name,
                    requestSchema: {
                        definitions: {
                            'dtmi:example:schema;1' : {
                                properties: {
                                    sensor0: {
                                        pattern: '^([\\d]{2}:){2}[\\d]{2}(.[\\d]+)?(Z)?([+|-][\\d]{2}:[\\d]{2})?$',
                                        required: [],
                                        title: 'sensor0',
                                        type: 'string'
                                    },
                                    sensor1: {
                                        required: [],
                                        title: 'sensor1',
                                        type: ['integer', 'null']
                                    },
                                    sensor2: {
                                        default: false,
                                        required: [],
                                        title: 'sensor2',
                                        type: 'boolean'
                                    }
                                },
                                required: [],
                                type: 'object'
                            }
                        },
                        properties: {
                            sensor: {
                                $ref: '#/definitions/dtmi:example:schema;1',
                                required: [],
                                title: 'sensor'
                            }
                        },
                        required: [],
                        title: 'commandWithReusableSchema',
                        type: 'object'
                    },
                    responseSchema: undefined
                }
            );
        });

        it('parses command with reusable schema not inline', () => {
            expect(jsonSchemaAdaptorWithResuableSchema.parseInterfaceCommandToJsonSchema(commandWithReusableSchemaNotInline)).toEqual(
                {
                    name: commandWithReusableSchemaNotInline.name,
                    requestSchema: undefined,
                    responseSchema: undefined
                }
            );
        });
    });

    describe('validate data with schema', () => {
        const testSchema = {
            additionalProperties: true,
            definitions: {},
            items: {
                description: 'Key of the map is: name',
                properties: {
                    age: {
                        title: 'age',
                        type: ['number', null]
                    },
                    name: {
                        title: 'name',
                        type: ['string']
                    }
                }
            },
            required: ['name', 'age'],
            title: 'testMap',
            type: 'array'
        };
        it('returns an empty list if map type validation is skipped', () => {
            expect(getSchemaValidationErrors({name: 'test', age: 4}, testSchema, true)).toEqual([]);
        });

        it('returns an list not array specific if map type validation is not totally skipped', () => {
            expect(getSchemaValidationErrors({name: 'test'}, testSchema)[0].message).toEqual('requires property \"age\"');
        });
    });

    describe('returns schema type', () => {
        it('returns simple schema type', () => {
            expect(getSchemaType('boolean')).toEqual('boolean');
        });

        it('returns complex schema type', () => {
            expect(getSchemaType({
                '@type': 'Map',
                'mapKey': {
                    name: 'telemetryName',
                    schema: 'string'
                },
                'mapValue': {
                    name: 'telemetryConfig',
                    schema: 'integer'
                }
            })).toEqual('Map');
        });

        it('returns invalid schema type', () => {
            expect(getSchemaType(['boolean'])).toEqual('--');
        });
    });

    describe('checks if schema is simple type', () => {
        it('returns is simple schema type', () => {
            expect(isSchemaSimpleType('boolean')).toEqual(true);
            expect(isSchemaSimpleType({
                '@id': 'dtmi:txs:cellular:RoamingStatus:ldbrgbd9;1',
                '@type': 'Enum',
                'displayName': {
                    en: 'Enum'
                },
                'valueSchema': 'integer',
                'enumValues': [{
                    '@id': 'dtmi:txs:cellular:RoamingStatus:ldbrgbd9:Home;1',
                    '@type': 'EnumValue',
                    'displayName': {
                        en: 'Home'
                    },
                    'enumValue': 0,
                    'name': 'Home'
                },
                {
                    '@id': 'dtmi:txs:cellular:RoamingStatus:ldbrgbd9:Roaming;1',
                    '@type': 'EnumValue',
                    'displayName': {
                        en: 'Roaming'
                    },
                    'enumValue': 1,
                    'name': 'Roaming'
                }]
            })).toEqual(true);
        });

        it('returns is complex schema type', () => {
            expect(isSchemaSimpleType({
                '@type': 'Map',
                'mapKey': {
                    name: 'telemetryName',
                    schema: 'string'
                },
                'mapValue': {
                    name: 'telemetryConfig',
                    schema: 'integer'
                }
            })).toEqual(false);
            expect(isSchemaSimpleType(['boolean'])).toEqual(false);
        });
    });
});
