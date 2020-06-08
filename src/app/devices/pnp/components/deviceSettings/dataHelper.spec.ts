/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { testDigitalTwin, testModelDefinition, testComponentName } from './testData';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';

describe('generateTwinSchemaAndInterfaceTuple', () => {
    it('returns interface settings tuple', () => {
        expect(generateTwinSchemaAndInterfaceTuple(testModelDefinition, testDigitalTwin, testComponentName).twinWithSchema[0]).toEqual({
            isComponentContainedInDigitalTwin: true,
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
});
