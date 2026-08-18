/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useEscapeGuard } from './useEscapeGuard';

const TestComponent: React.FC<{ onSurfaceEscape: () => void }> = ({ onSurfaceEscape }) => {
    const escapeGuard = useEscapeGuard();

    // Stands in for Fluent's DialogSurface, which closes on Escape unless the event was
    // default-prevented before it bubbled up.
    const handleSurfaceKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' && !event.isDefaultPrevented()) {
            onSurfaceEscape();
        }
    };

    return (
        <div onKeyDown={handleSurfaceKeyDown}>
            <input aria-label="first" {...escapeGuard} />
            <input aria-label="second" {...escapeGuard} />
        </div>
    );
};

describe('useEscapeGuard', () => {
    it('absorbs the first escape and lets the second one through', () => {
        const onSurfaceEscape = jest.fn();
        render(<TestComponent onSurfaceEscape={onSurfaceEscape} />);
        const input = screen.getByLabelText('first');

        fireEvent.keyDown(input, { key: 'Escape' });
        expect(onSurfaceEscape).not.toHaveBeenCalled();

        fireEvent.keyDown(input, { key: 'Escape' });
        expect(onSurfaceEscape).toHaveBeenCalledTimes(1);
    });

    it('restarts the sequence when the user keeps typing', () => {
        const onSurfaceEscape = jest.fn();
        render(<TestComponent onSurfaceEscape={onSurfaceEscape} />);
        const input = screen.getByLabelText('first');

        fireEvent.keyDown(input, { key: 'Escape' });
        fireEvent.keyDown(input, { key: 'a' });
        fireEvent.keyDown(input, { key: 'Escape' });

        expect(onSurfaceEscape).not.toHaveBeenCalled();
    });

    it('restarts the sequence when focus moves to another field', () => {
        const onSurfaceEscape = jest.fn();
        render(<TestComponent onSurfaceEscape={onSurfaceEscape} />);

        fireEvent.keyDown(screen.getByLabelText('first'), { key: 'Escape' });
        fireEvent.blur(screen.getByLabelText('first'));
        fireEvent.keyDown(screen.getByLabelText('second'), { key: 'Escape' });

        expect(onSurfaceEscape).not.toHaveBeenCalled();
    });

    it('does not interfere with other keys', () => {
        const onSurfaceEscape = jest.fn();
        render(<TestComponent onSurfaceEscape={onSurfaceEscape} />);

        fireEvent.keyDown(screen.getByLabelText('first'), { key: 'Enter' });
        expect(onSurfaceEscape).not.toHaveBeenCalled();
    });
});
