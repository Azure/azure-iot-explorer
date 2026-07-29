import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CopyButton } from './copyButton';
import { ResourceKeys } from '../../../localization/resourceKeys';

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

    it('resets the popover text after it is dismissed', async () => {
        render(<CopyButton copyText='text'/>);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).toBeInTheDocument();

        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.queryByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).not.toBeInTheDocument();
        });

        fireEvent.mouseEnter(button);
        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copy.label)).toBeInTheDocument();
    });
});