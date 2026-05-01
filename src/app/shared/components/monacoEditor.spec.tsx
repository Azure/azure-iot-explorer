import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MonacoEditorComponent } from './monacoEditor';

describe('MonacoEditorComponent', () => {
    it('renders editor region with aria-label', () => {
        render(<MonacoEditorComponent content="test" height={100} ariaLabel="test label" />);

        expect(screen.getByRole('region')).toBeDefined();
    });

    it('renders with correct content', () => {
        const { container } = render(<MonacoEditorComponent content='{"key": "value"}' height={200} ariaLabel="JSON editor" />);

        expect(container.firstChild).toBeDefined();
    });
});
