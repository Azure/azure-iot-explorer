/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { testTwin, testModelDefinition, testComponentName, modelInformationReportedValue } from './testData';
import { generateReportedTwinSchemaAndInterfaceTuple } from './dataHelper';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';

describe('getDevicePropertyProps', () => {
    it('returns interface property tuple for component', () => {
        const result = generateReportedTwinSchemaAndInterfaceTuple(testModelDefinition, testTwin, testComponentName)[0];
        expect(result.propertyModelDefinition).toEqual(testModelDefinition.contents[0]);
        expect(result.reportedTwin).toEqual(modelInformationReportedValue);
        expect(result.propertySchema.title).toEqual('modelInformation');
    });

    it('returns interface property tuple for root level component', () => {
        const result = generateReportedTwinSchemaAndInterfaceTuple(testModelDefinition, testTwin, DEFAULT_COMPONENT_FOR_DIGITAL_TWIN)[0];
        expect(result.propertyModelDefinition).toEqual(testModelDefinition.contents[0]);
        expect(result.reportedTwin).toEqual(modelInformationReportedValue);
        expect(result.propertySchema.title).toEqual('modelInformation');
    });
});
