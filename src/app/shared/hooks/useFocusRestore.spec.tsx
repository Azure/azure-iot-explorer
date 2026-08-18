/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { restoreFocusTo, useFocusRestoreOnClose } from './useFocusRestore';

describe('restoreFocusTo', () => {
    it('focuses the provided element', () => {
        render(<button>trigger</button>);
        const button = screen.getByText('trigger');

        act(() => restoreFocusTo(button));

        expect(document.activeElement).toBe(button);
    });

    it('does nothing when the element is null', () => {
        render(<button>trigger</button>);
        const previous = document.activeElement;

        act(() => restoreFocusTo(null));

        expect(document.activeElement).toBe(previous);
    });

    it('does nothing when the element is no longer in the document', () => {
        const detached = document.createElement('button');
        const focus = jest.spyOn(detached, 'focus');

        act(() => restoreFocusTo(detached));

        expect(focus).not.toHaveBeenCalled();
    });

    it('re-asserts focus when a focus trap steals it back on a later frame', async () => {
        render(<><button>trigger</button><button>thief</button></>);
        const button = screen.getByText('trigger');
        const thief = screen.getByText('thief');

        act(() => restoreFocusTo(button));
        // Stand in for Fluent's trap, which pulls focus back inside the surface while it
        // is still mounted playing its exit motion.
        act(() => { thief.focus(); });

        await waitFor(() => expect(document.activeElement).toBe(button));
    });
});

describe('useFocusRestoreOnClose', () => {
    const TestComponent: React.FC<{ skipOnClose?: boolean }> = ({ skipOnClose }) => {
        const [open, setOpen] = React.useState(false);
        const invokerRef = React.useRef<HTMLButtonElement>(null);
        const { skipNextRestore } = useFocusRestoreOnClose(open, () => invokerRef.current);

        return (
            <>
                <button ref={invokerRef} onClick={() => setOpen(true)}>open</button>
                {open &&
                    <button onClick={() => { if (skipOnClose) { skipNextRestore(); } setOpen(false); }}>close</button>
                }
            </>
        );
    };

    it('returns focus to the element that opened the surface once it closes', () => {
        render(<TestComponent/>);
        const opener = screen.getByText('open');

        act(() => { opener.click(); });
        expect(document.activeElement).not.toBe(opener);

        act(() => { screen.getByText('close').click(); });

        expect(document.activeElement).toBe(opener);
    });

    it('does not move focus while the surface is still open', () => {
        render(<TestComponent/>);
        const opener = screen.getByText('open');
        const previous = document.activeElement;

        act(() => { opener.click(); });

        expect(document.activeElement).toBe(previous);
    });

    it('skips a single restore when asked to', () => {
        render(<TestComponent skipOnClose={true}/>);
        const opener = screen.getByText('open');
        const previous = document.activeElement;

        act(() => { opener.click(); });
        act(() => { screen.getByText('close').click(); });

        expect(document.activeElement).toBe(previous);
        expect(document.activeElement).not.toBe(opener);
    });
});
