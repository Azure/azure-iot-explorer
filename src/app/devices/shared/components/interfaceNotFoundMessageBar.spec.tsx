/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InterfaceNotFoundMessageBar } from './interfaceNotFoundMessageBar';

describe('interfaceNotFoundMessageBar', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><InterfaceNotFoundMessageBar/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
