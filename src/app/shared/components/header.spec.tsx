/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { Header } from './header';

describe('Header', () => {
    it('renders header', () => {
        const { container } = render(<Header/>);
        expect(container).toBeDefined();
    });
});
