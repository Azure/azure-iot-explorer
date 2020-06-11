/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { testDigitalTwin, testModelDefinition, testComponentName, modelInformationReportedValue } from './testData';
import { generateReportedTwinSchemaAndInterfaceTuple } from './dataHelper';

describe('getDevicePropertyProps', () => {
    it('returns interface property tuple', () => {
        const result = generateReportedTwinSchemaAndInterfaceTuple(testModelDefinition, testDigitalTwin, testComponentName)[0];
        expect(result.propertyModelDefinition).toEqual(testModelDefinition.contents[0]);
        expect(result.reportedTwin).toEqual(modelInformationReportedValue);
        expect(result.propertySchema.title).toEqual('modelInformation');
    });
});
