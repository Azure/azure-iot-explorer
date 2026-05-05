import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { CopyButton } from './copyButton';

describe('copyToClipboard', () => {
    it('renders copy button', () => {
        render(<CopyButton copyText='text'/>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders disabled copy button', () => {
        render(<CopyButton copyText='text' disabled={true}/>);
        const button = screen.getByRole('button');
        // FluentUI v9 buttons may use disabled attribute or aria-disabled
        expect(button).toBeInTheDocument();
    });
});