/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { testTwin, testModelDefinition, testComponentName } from './testData';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';

describe('generateTwinSchemaAndInterfaceTuple', () => {
    it('returns interface settings tuple for component', () => {
        expect(generateTwinSchemaAndInterfaceTuple(testModelDefinition, testTwin, testComponentName)[0]).toEqual({
            desiredValue: 456,
            reportedSection: {
                "value": 123,
                "ac": 200,
                "ad": "success",
                "av": 2
            },
            settingModelDefinition: testModelDefinition.contents[0],
            settingSchema: {
                definitions: {},
                required: [],
                title: testModelDefinition.contents[0].name,
                type: ['number', 'null']
            }
        });
    });

    it('returns interface settings tuple for root level component', () => {
        expect(generateTwinSchemaAndInterfaceTuple(testModelDefinition, testTwin, DEFAULT_COMPONENT_FOR_DIGITAL_TWIN)[0]).toEqual({
            desiredValue: 5678,
            reportedSection: {
                "value": 1234,
                "ac": 200,
                "ad": "success",
                "av": 2
            },
            settingModelDefinition: testModelDefinition.contents[0],
            settingSchema: {
                definitions: {},
                required: [],
                title: testModelDefinition.contents[0].name,
                type: ['number', 'null']
            }
        });
    });
});
