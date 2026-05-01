/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { NoMatchError } from './noMatchError';

describe('shared/components/noMatchError', () => {

    it('renders title and button properly', () => {
        const { container } = render(<NoMatchError/>);
        expect(container.querySelector('h2')).toBeDefined();
        expect(container.querySelector('p')).toBeDefined();
        expect(container.querySelector('a, button')).toBeDefined();
    });
});