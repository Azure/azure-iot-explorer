/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getShortHostName } from './utils';

describe('getShortHostName', () => {
    it('returns expected value', () => {
        expect(getShortHostName('hubName.azure-devices.net')).toEqual('hubName');
    });
});