/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Loader } from './loader';

import { render } from '@testing-library/react';
describe('Loader', () => {
    it('matches snapshot when loading', () => {
        expect(render(<Loader monitoringData={true}/>)).toBeDefined();
    });

    it('matches snapshot when not loading', () => {
        expect(render(<Loader monitoringData={false}/>)).toBeDefined();
    });
});