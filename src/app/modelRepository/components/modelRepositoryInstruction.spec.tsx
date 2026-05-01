/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ModelRepositoryInstruction } from './modelRepositoryInstruction';

import { render } from '@testing-library/react';
describe('ModelRepositoryInstruction', () => {
    it('matches snapshot', () => {
        expect(render(<ModelRepositoryInstruction/>)).toBeDefined();
    });
});
