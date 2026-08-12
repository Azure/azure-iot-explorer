/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { restoreFocusTo, useFocusRestore } from './useFocusRestore';

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
});

describe('useFocusRestore', () => {
    const TestComponent: React.FC = () => {
        const { captureInvoker, restoreFocus } = useFocusRestore();
        const [open, setOpen] = React.useState(false);

        return (
            <>
                <button
                    onClick={event => { captureInvoker(event.currentTarget); setOpen(true); }}
                >
                    open
                </button>
                {open && <button onClick={() => { setOpen(false); restoreFocus(); }}>close</button>}
            </>
        );
    };

    it('returns focus to the element that opened the surface', () => {
        render(<TestComponent/>);
        const opener = screen.getByText('open');

        act(() => { opener.click(); });
        act(() => { screen.getByText('close').click(); });

        expect(document.activeElement).toBe(opener);
    });

    it('captures the active element when no element is supplied', () => {
        const Component: React.FC = () => {
            const { captureInvoker, restoreFocus } = useFocusRestore();
            return (
                <>
                    <button onClick={() => captureInvoker()}>capture</button>
                    <button onClick={() => restoreFocus()}>restore</button>
                </>
            );
        };

        render(<Component/>);
        const capture = screen.getByText('capture');
        const restore = screen.getByText('restore');

        act(() => { capture.focus(); capture.click(); });
        act(() => { restore.focus(); restore.click(); });

        expect(document.activeElement).toBe(capture);
    });
});
