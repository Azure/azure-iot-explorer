/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResizableDetailsList, SelectionMode } from './resizableDetailsList';
import * as React from 'react';

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

    it('returns focus to the column header when the resize dialog is dismissed', () => {
        render(<ResizableDetailsList
            items={[{ key: 'value' }]}
            columns={[{ key: 'key', minWidth: 100, name: 'Key' }]}
            selectionMode={SelectionMode.none}
            onRenderItemColumn={() => <span>value</span>}
        />);

        const headerCell = screen.getByRole('columnheader');
        fireEvent.click(headerCell);
        fireEvent.click(screen.getByText('resizableDetailsList.buttons.resize'));
        fireEvent.click(screen.getByText('resizableDetailsList.buttons.cancel'));

        expect(document.activeElement).toBe(headerCell);
    });
});
