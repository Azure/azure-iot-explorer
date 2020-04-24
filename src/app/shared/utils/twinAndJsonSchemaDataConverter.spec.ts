/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { ParseNestedMapNotSupportedException } from './exceptions/parseNestedMapNotSupportedException';
import { dataToTwinConverter,
    twinToFormDataConverter,
    getNumberOfMapsInSchema,
    findPathsTowardsMapType } from './twinAndJsonSchemaDataConverter';

describe('top level map converter', () => {

    const formDataWithTopLevelMap = [
        {
            telemetryName: '73c53631-66f0-4a9b-8cf2-56b50b00d699',
            telemetryConfig: 'foo' // tslint:disable-line:object-literal-sort-keys
        }
    ];

    const twinWithTopLevelMap = {
        '73c53631-66f0-4a9b-8cf2-56b50b00d699': 'foo'
    };

    const settingWithTopLevelMap = {
        additionalProperties: true,
        items: {
            properties: {
                telemetryConfig: {type: 'string'},
                telemetryName: {type: 'string'}
            },
            required: ['telemetryName', 'telemetryConfig'],
            type: 'object'
        },
        required: null,
        title: 'MapValStringValue',
        type: 'array'
    };

    const pathsInSetting = [{keyName: 'telemetryName', path: ['MapValStringValue'], valueName: 'telemetryConfig'}];
    const numberOfPathExpected = 1;

    it('matches the number of path towards map type', () => {
        expect(getNumberOfMapsInSchema(settingWithTopLevelMap)).toBe(numberOfPathExpected);
    });

    it('finds the right path towards map type',  () => {
        expect(findPathsTowardsMapType(settingWithTopLevelMap, [], numberOfPathExpected)).toEqual(pathsInSetting);
    });

    it('transforms json twin to form data successfully',  () => {
        const result = twinToFormDataConverter(twinWithTopLevelMap, settingWithTopLevelMap);
        expect(result.formData).toEqual(formDataWithTopLevelMap);
    });

    it('returns null if not provided',  () => {
        expect(dataToTwinConverter(null, null).twin).toEqual(null);
    });

    it('transforms json form data to twin successfully',  () => {
        expect(dataToTwinConverter(formDataWithTopLevelMap, settingWithTopLevelMap).twin).toEqual(twinWithTopLevelMap);
    });

    const formDataWithNoMatchingPath = {
        MapValIntegerValue: [
            {
                telemetryName: '73c53631-66f0-4a9b-8cf2-56b50b00d699',
                telemetryConfig: 1234 // tslint:disable-line:object-literal-sort-keys
            }
        ]
    };

    it('transforms json form data to twin and would return empty form data if form data has no corresponding path',  () => {
        expect(dataToTwinConverter(formDataWithNoMatchingPath, settingWithTopLevelMap).twin).toEqual({});
    });
});

describe('nested map type converter', () => {
    const settingSchemaWithMapInObject = {
        properties: {
            commands: {
                additionalProperties: true,
                items: {
                    properties: {
                        commandConfig: {
                            properties: {
                                conversionCoefficient: {title: 'conversionCoefficient', type: 'number'},
                                dataType: {title: 'dataType", type: "string'},
                                length: {title: 'length', type: 'integer'}
                            },
                            type: 'object'
                        },
                        commandName: {type: 'string'}
                    },
                    required: ['commandName', 'commandConfig']
                },
                required: null,
                title: 'commands',
                type: 'array'
            },
            interfaceId: {title: 'interfaceId', type: 'string'},
            telemetry: {
                additionalProperties: true,
                items: {
                    properties: {
                        telemetryConfig: {
                            properties: {
                                dataType: {title: 'dataType', type: 'string'},
                                startAddress: {title: 'startAddress', type: 'integer'}
                            },
                            type: 'object'
                        },
                        telemetryName: {type: 'string'},
                    },
                    required: ['telemetryName', 'telemetryConfig']
                },
                required: null,
                title: 'telemetry',
                type: 'array'
            },
        },
        required: null,
        title: 'interfaceConfig',
        type: 'object'
    };

    const twinWithMapInObject = {
        commands: undefined as any,  // tslint:disable-line: no-any
        interfaceId: '1',
        telemetry: {
            testTelemetry: { dataType: '2', startAddress: 3 }
        }
    };

    const formDataWithMapInObject = {
        commands: undefined as any,  // tslint:disable-line: no-any
        interfaceId: '1',
        telemetry: [
            {
                telemetryConfig: {dataType: '2', startAddress: 3},
                telemetryName: 'testTelemetry'
            }
        ]
    };

    const pathsInSetting = [
        {keyName: 'commandName', path: ['interfaceConfig', 'commands'], valueName: 'commandConfig'},
        {keyName: 'telemetryName', path: ['interfaceConfig', 'telemetry'], valueName: 'telemetryConfig'}];
    const numberOfPathExpected = 2;

    it('matches the number of path towards map type', () => {
        expect(getNumberOfMapsInSchema(settingSchemaWithMapInObject)).toBe(numberOfPathExpected);
    });

    it('finds the right path towards map type',  () => {
        expect(findPathsTowardsMapType(settingSchemaWithMapInObject, [], numberOfPathExpected)).toEqual(pathsInSetting);
    });

    it('transforms json twin to form data successfully',  () => {
        const result = twinToFormDataConverter(twinWithMapInObject, settingSchemaWithMapInObject);
        expect(result.formData).toEqual(formDataWithMapInObject);
    });

    it('transforms json form data to twin successfully',  () => {
        expect(dataToTwinConverter(formDataWithMapInObject, settingSchemaWithMapInObject).twin).toEqual(twinWithMapInObject);
    });

    const formDataWithNoMatchingPath = {
        interfaceConfig2: {
            commands: undefined as any,  // tslint:disable-line: no-any
            interfaceId: '1',
            telemetry: {
                testTelemetry: { dataType: '2', startAddress: 3 }
            }
        }
    };

    it('transforms json form data to twin and would leave form data intact if form data has no corresponding path',  () => {
        expect(dataToTwinConverter(formDataWithNoMatchingPath, settingSchemaWithMapInObject).twin).toEqual(formDataWithNoMatchingPath);
    });

    const twinWithNoMatchingPath = {
        interfaceConfig2: {
            commands: undefined as any,  // tslint:disable-line: no-any
            interfaceId: '1',
            telemetry: {
                testTelemetry: { dataType: '2', startAddress: 3 }
            }
        }
    };

    it('transforms json twin to form data and would leave twin intact if form data has no corresponding path',  () => {
        expect(twinToFormDataConverter(twinWithNoMatchingPath, settingSchemaWithMapInObject).formData).toEqual(twinWithNoMatchingPath);
    });
});

describe('map in map converter', () => {
    const formDataWithMapInMap =
    {
        Map_With_Map: [
            {
                test: [
                    {level_2_Name: '1', level_2_Config: 2}
                ]
            }
        ]
    };

    const twinWithMapInMap =
    {
        Map_With_Map:
            {
                test: {1:  2}
            }
    };

    const settingSchemaWithMapInMap =
    {
        additionalProperties: true,
        items: { // items would.properties would always only have one object key
            properties: {
                level_1_Key: {type: 'string'},
                level_1_Name: {
                    additionalProperties: true,
                    items: {
                        properties: {
                            level_2_Config: {type: 'integer'},
                            level_2_Name: {type: 'string'}
                        },
                        required: ['level_2_Name', 'level_2_Config'],
                        type: 'object',
                    },
                    type: 'array'
                }
            },
            required: ['level_1_Key', 'level_1_Name'],
            type: 'object'
        },
        required: null,
        title: 'Map With Map',
        type: 'array',
    };

    const numberOfPathExpected = 2;

    it('matches the number of path towards map type', () => {
        expect(getNumberOfMapsInSchema(settingSchemaWithMapInMap)).toBe(numberOfPathExpected);
    });

    it('throws if has nested map type',  () => {
        expect(() => findPathsTowardsMapType(settingSchemaWithMapInMap, [], numberOfPathExpected)).toThrow(ParseNestedMapNotSupportedException);
    });

    it('returns error if schema has nested map type', () => {
        const result = dataToTwinConverter(formDataWithMapInMap, settingSchemaWithMapInMap);
        expect(result.error.type).toBe('parseNestedMapNotSupportedException');
    });

    it('returns error if schema has nested map type', () => {
        const result = twinToFormDataConverter(twinWithMapInMap, settingSchemaWithMapInMap);
        expect(result.error.type).toBe('parseNestedMapNotSupportedException');
    });
});
