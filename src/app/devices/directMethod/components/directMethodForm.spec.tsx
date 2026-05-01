/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { DirectMethodForm } from './directMethodForm';


describe('directMethodForm', () => {
    it('renders without crashing', () => {
        const { container } = render(<DirectMethodForm/>);
        expect(container).toBeDefined();
    });
});
