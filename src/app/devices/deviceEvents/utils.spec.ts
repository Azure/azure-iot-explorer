/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setDecoderInfo } from './utils';

describe('setDecoderInfo', () => {
    it('returns expected prototype if user input is correct', async () => {
        const params = {decoderFile: new File([], ''), decoderPrototype: '', decodeType: 'Protobuf'};
        const prototype = await setDecoderInfo(params);
        expect(prototype.name).toEqual('');
    });

    it('returns error message if decode prototype is not found in file', async () => {
        const params = {decoderFile: new File([], ''), decoderPrototype: 'asd', decodeType: 'Protobuf'};
        await expect(setDecoderInfo(params)).rejects.toThrowError('no such type: asd');
    });
});