/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { HomeViewNavigation } from './homeViewNavigation';

import { render } from '@testing-library/react';
describe('homeViewNavigation', () => {
    it('matches snapshot', () => {
        expect(render(<HomeViewNavigation />)).toBeDefined();

    });
});
