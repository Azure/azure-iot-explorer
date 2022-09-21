/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Type } from 'protobufjs';
import { setDecoderInfo } from './utils';

describe('setDecoderInfo', () => {
    it('returns expected prototype if user input is correct', async () => {
        const params = {decoderFile: new File([], ''), decoderType: '', isContentTypeCustomized: true};
        const prototype = await setDecoderInfo(params);
        expect(prototype.name).toEqual('');
    });

    it('returns error message if decode type is not found in file', async () => {
        const params = {decoderFile: new File([], ''), decoderType: 'asd', isContentTypeCustomized: true};
        await expect(setDecoderInfo(params)).rejects.toThrowError('no such type: asd');
    });
});