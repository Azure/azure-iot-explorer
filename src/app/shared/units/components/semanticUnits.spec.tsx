/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { SemanticUnit } from './semanticUnit';
import * as SemanticUnits from '../semanticUnits';

describe('SemanticUnit', () => {
    it('renders empty marker when unit host is undefined', () => {
        render(<SemanticUnit unitHost={undefined}/>);
        expect(screen.getByText('--')).toBeInTheDocument();
    });

    it('renders empty marker when unit is undefined', () => {
        render(<SemanticUnit unitHost={{}}/>);
        expect(screen.getByText('--')).toBeInTheDocument();
    });

    it('renders unit name when unit is unlisted', () => {
        render(<SemanticUnit unitHost={{unit: 'fizzbin'}}/>);
        expect(screen.getByText('fizzbin')).toBeInTheDocument();
    });

    it('renders unit info when unit is listed', () => {
        const spy = jest.spyOn(SemanticUnits, 'getSemanticUnit');
        spy.mockReturnValue({
            abbreviation: 'abbr',
            displayName: 'displayName'
        });

        render(<SemanticUnit unitHost={{unit: 'fizzbin'}}/>);
        expect(screen.getByText(/abbr/)).toBeInTheDocument();
    });
});
