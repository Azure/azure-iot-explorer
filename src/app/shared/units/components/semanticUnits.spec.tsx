/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { SemanticUnit } from './semanticUnit';
import * as SemanticUnits from '../semanticUnits';

describe('SemanticUnit', () => {
    it('matches snapshot when unit host is undefined', () => {
        expect(shallow(<SemanticUnit unitHost={undefined}/>)).toMatchSnapshot();

    });

    it('matches snapshot when unit is undefined', () => {
        expect(shallow(<SemanticUnit unitHost={{}}/>)).toMatchSnapshot();

    });

    it('matches snapshot when unit is unlisted', () => {
        expect(shallow(<SemanticUnit unitHost={{unit: 'fizzbin'}}/>)).toMatchSnapshot();

    });

    it('matches snapshot when unit is listed', () => {
        const spy = jest.spyOn(SemanticUnits, 'getSemanticUnit');
        spy.mockReturnValue({
            abbreviation: 'abbr',
            displayName: 'displayName'
        });

        expect(shallow(<SemanticUnit unitHost={{unit: 'fizzbin'}}/>)).toMatchSnapshot();
    });
});
