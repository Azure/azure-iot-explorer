/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { ListPaging } from './listPaging';


describe('components/devices/listPaging', () => {
    it('renders without crashing', () => {
        const { container } = render(<ListPaging/>);
        expect(container).toBeDefined();
    });
});
