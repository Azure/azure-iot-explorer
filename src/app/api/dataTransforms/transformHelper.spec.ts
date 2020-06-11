/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { parseDateTimeString } from './transformHelper';

describe('transformHelper', () => {

    describe('parseDateTimeString', () => {
        it('parses date time string', () => {
            const isLocalTime = new RegExp(/\d+:\d+:\d+ [AP]M, 07\/18\/2019/);
            expect(parseDateTimeString('2019-07-18T10:01:20.0568390Z').match(isLocalTime)).toBeTruthy();
            expect(parseDateTimeString('0001-01-01T00:00:00')).toEqual(null);
            expect(parseDateTimeString('')).toEqual(null);
            expect(parseDateTimeString('someday')).toEqual(null);
        });
    });
});
