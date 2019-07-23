/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { parseInterfacePropertyToJsonSchema, parseInterfaceCommandToJsonSchema, parseInterfaceTelemetryToJsonSchema } from './jsonSchemaAdaptor';
import { PropertyContent, TelemetryContent, CommandContent } from '../../api/models/modelDefinition';

describe('parse interface model definition to Json schema', () => {
    it('simple property can be converted to json schema format', () => {
        /* tslint:disable */
        const interfacePropertyDefinition: PropertyContent =
            {
                "@type": "Property",
                "name": "fwVersion",
                "displayName": "Firmware version",
                "schema": "string",
                "comment": "Version of the firmware on your device. Ex. 1.3.45"
            }
        /* tslint:enable */

        const interfacePropertyInJsonSchema =
            {
                description: 'Firmware version',
                title: 'fwVersion',
                type: 'string'
            };
        expect(parseInterfacePropertyToJsonSchema(interfacePropertyDefinition)).toEqual(interfacePropertyInJsonSchema);
    });

    it('simple property can be converted to json schema format with displayUnit', () => {
        /* tslint:disable */
        const interfacePropertyDefinition = {
            "@type": "Property",
            "name": "totalStorage",
            "displayName": "Total storage",
            "schema": "double",
            "displayUnit": "MB",
            "comment": "Total available storage on the device in MB. Ex. 2048 MB."
        };
        /* tslint:enable */
        const interfacePropertyInJsonSchema =
            {
                description: 'Total storage ( Unit: MB )',
                title: 'totalStorage',
                type: 'number'
            };
        expect(parseInterfacePropertyToJsonSchema(interfacePropertyDefinition)).toEqual(interfacePropertyInJsonSchema);
    });

    it('complex property can be converted to json schema format', () => {
        /* tslint:disable */
        const interfacePropertyDefinition = {
			"@type": "Property",
			"name": "modelInformation",
			"displayName": "Model Information",
			"description": "Providing model and optional interfaces information on a digital twin.",
			"schema": {
				"@type": "Object",
				"fields": [
					{
						"name": "modelId",
						"schema": "string"
					},
					{
						"name": "interfaces",
						"schema": {
							"@type": "Map",
							"mapKey": {
								"name": "name",
								"schema": "string"
							},
							"mapValue": {
								"name": "schema",
								"schema": "string"
							}
						}
					}
				]
			}
		};
        /* tslint:enable */
        const interfacePropertyInJsonSchema = {
            description: 'Model Information/Providing model and optional interfaces information on a digital twin.',
            properties:  {
                interfaces:  {
                    additionalProperties: true,
                    description: '',
                    items:  {
                        description: `interfaces's key: name`,
                        properties:  {
                            name:  {
                                type: 'string',
                            },
                            schema:  {
                                description: '',
                                title: 'schema',
                                type: 'string',
                            }
                        },
                        required: [
                            'name',
                            'schema'
                        ],
                        type: 'object',
                    },
                    title: 'interfaces',
                    type: 'array',
                },
                modelId: {
                    description: '',
                    title: 'modelId',
                    type: 'string',
                }
            },
            title: 'modelInformation',
            type: 'object'
        };
        expect(parseInterfacePropertyToJsonSchema(interfacePropertyDefinition)).toEqual(interfacePropertyInJsonSchema);
    });

    it('interface schema is not supported and returns undefined', () => {
        /* tslint:disable */
        const interfacePropertyDefinition: PropertyContent =
            {
                "@type": "Property",
                "name": "accelerometer1",
                "schema": "urn:example:acceleration:1"
            }
        /* tslint:enable */

        expect(parseInterfacePropertyToJsonSchema(interfacePropertyDefinition)).toEqual(undefined);
    });

    it('simple command with displayName in request can be converted to json schema format', () => {
        /* tslint:disable */
        const interfaceCommandDefinition: CommandContent = {
            "@type": "Command",
            "name": "blink",
            "displayName": "This command will begin blinking the LED for given time interval.",
            "request": {
                "name": "blinkRequest",
                "displayName": "blink interval",
                "description": "blinking the LED for given time interval",
				"schema": "long"
			},
			"response": {
				"name": "blinkResponse",
				"schema": "string"
			},
			"commandType": "synchronous"
        };
        /* tslint:enable */
        const interfaceCommandInJsonSchema =
            {
                description: 'This command will begin blinking the LED for given time interval.',
                name: 'blink',
                requestSchema: {
                    description: 'blink interval/blinking the LED for given time interval',
                    title: 'blinkRequest',
                    type: 'number'
                },
                responseSchema: {
                    description: '',
                    title: 'blinkResponse',
                    type: 'string'
                }
            };
        expect(parseInterfaceCommandToJsonSchema(interfaceCommandDefinition)).toEqual(interfaceCommandInJsonSchema);
    });

    it('simple telemetry with semantic type can be converted to json schema format', () => {
        /* tslint:disable */
        const interfaceTelemetryDefinition: TelemetryContent =
        {
			"@type": [
				"Telemetry",
				"SemanticType/Temperature"
			],
			"description": "Current temperature on the device",
			"displayName": "Temperature",
			"name": "temp",
			"schema": "double",
			"unit": "Units/Temperature/fahrenheit"
		}
        /* tslint:enable */

        const interfaceTelemetryInJsonSchema =
            {
                description: 'Temperature/Current temperature on the device ( Unit: Units/Temperature/fahrenheit )',
                title: 'temp',
                type: 'number'
            };
        expect(parseInterfaceTelemetryToJsonSchema(interfaceTelemetryDefinition)).toEqual(interfaceTelemetryInJsonSchema);
    });
});
