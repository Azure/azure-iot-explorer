/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { render } from '@testing-library/react';
import { ResizableDetailsList } from './resizableDetailsList';
import * as React from 'react';
import { SelectionMode } from './resizableDetailsList';

describe('ResizableDetailsList', () => {
    it('renders data grid', () => {
        const { container } = render(<ResizableDetailsList
            items={[]}
            columns={[]}
            selectionMode={SelectionMode.none}
            onRenderItemColumn={jest.fn()}
        />);
        expect(container).toBeDefined();
    });
});
