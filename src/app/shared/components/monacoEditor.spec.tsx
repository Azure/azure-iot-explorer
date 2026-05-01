import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MonacoEditorComponent } from './monacoEditor';

describe('MonacoEditorComponent', () => {
    it('renders editor container', () => {
        const { container } = render(<MonacoEditorComponent content="test" height={100} ariaLabel="test label" />);
        expect(container).toBeDefined();
    });
});
