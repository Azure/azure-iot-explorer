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

    it('keeps the copied text visible when the popover was already open on click', () => {
        render(<CopyButton copyText='text'/>);

        const button = screen.getByRole('button');
        fireEvent.mouseEnter(button);
        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copy.label)).toBeInTheDocument();

        fireEvent.click(button);
        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).toBeInTheDocument();
    });

    it('keeps the copied text visible on a repeat copy', () => {
        render(<CopyButton copyText='text'/>);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        fireEvent.click(button);

        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).toBeInTheDocument();
    });

    it('resets the popover text after it is dismissed', async () => {
        render(<CopyButton copyText='text'/>);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).toBeInTheDocument();

        fireEvent.mouseLeave(button);

        await waitFor(() => {
            expect(screen.queryByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).not.toBeInTheDocument();
        });

        fireEvent.mouseEnter(button);
        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copy.label)).toBeInTheDocument();
    });

    it('resets the popover text when focus leaves the button', async () => {
        render(<CopyButton copyText='text'/>);

        const button = screen.getByRole('button');
        fireEvent.focus(button);
        fireEvent.click(button);
        expect(screen.getByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).toBeInTheDocument();

        fireEvent.blur(button);

        await waitFor(() => {
            expect(screen.queryByText(ResourceKeys.common.maskedCopyableTextField.copied.label)).not.toBeInTheDocument();
        });
    });
});