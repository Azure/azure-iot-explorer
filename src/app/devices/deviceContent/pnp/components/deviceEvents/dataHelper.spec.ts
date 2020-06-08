/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { testModelDefinition } from './testData';
import { getDeviceTelemetry } from './dataHelper';

describe('getDeviceTelemetry', () => {
    it('returns interface settings tuple', () => {
        const result = getDeviceTelemetry(testModelDefinition)[0];
        expect(result.parsedSchema.title).toEqual('humid');
    });
});
