/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { getConnectionStrings } from './getConnectionStringsSaga';

describe('getConnectionString', () => {
    it('returns expected value', () => {
        const setValue = 'helloworld';
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, setValue);
        expect(getConnectionStrings()).toEqual([setValue]);
    });
});
