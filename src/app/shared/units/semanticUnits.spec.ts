/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getSemanticUnit, semanticUnits } from './semanticUnits';

describe('getSemanticUnit', () => {
    it('returns undefined when unit name is undefined', () => {
        expect(getSemanticUnit(undefined)).toEqual(undefined);
    });

    it('returns undefined when unit name is unlisted', () => {
        expect(getSemanticUnit('fizzbin')).toEqual(undefined);
    });

    it('returns listed semantic unit with expected value', () => {
        semanticUnits.fizzbin = {
            abbreviation: 'abbr',
            displayName: 'displayName'
        };

        expect(getSemanticUnit('fizzbin')).toEqual({
            abbreviation: 'abbr',
            displayName: 'displayName'
        });
    });
});
