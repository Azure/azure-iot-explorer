/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { getLocalizedData } from './modelDefinitionTransform';

describe('modelDefinitionTransform', () => {

    describe('getLocalizedData', () => {
        it('transforms data to localized data', () => {
            expect(getLocalizedData('Model Information description')).toEqual('Model Information description');
            expect(getLocalizedData({en: 'Model Information description'})).toEqual('Model Information description');
            expect(getLocalizedData({})).toEqual('');
            expect(getLocalizedData({zh: '模型信息'})).toEqual('');
        });
    });
});
