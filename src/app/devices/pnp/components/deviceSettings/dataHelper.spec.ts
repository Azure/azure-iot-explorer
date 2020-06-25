/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { testDigitalTwin, testModelDefinition, testComponentName } from './testData';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';

describe('generateTwinSchemaAndInterfaceTuple', () => {
    it('returns interface settings tuple for component', () => {
        expect(generateTwinSchemaAndInterfaceTuple(testModelDefinition, testDigitalTwin, testComponentName).twinWithSchema[0]).toEqual({
            isComponentContainedInDigitalTwin: true,
            metadata: {
                desiredValue: 456,
                desiredVersion: 2,
                lastUpdateTime: '2020-03-31T23:17:42.4813073Z',
            },
            reportedTwin: 123,
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
        expect(generateTwinSchemaAndInterfaceTuple(testModelDefinition, testDigitalTwin, DEFAULT_COMPONENT_FOR_DIGITAL_TWIN).twinWithSchema[0]).toEqual({
            isComponentContainedInDigitalTwin: true,
            metadata: {
                desiredValue: 5678,
                desiredVersion: 2,
                lastUpdateTime: '2020-03-31T23:17:42.4813073Z',
            },
            reportedTwin: 1234,
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
