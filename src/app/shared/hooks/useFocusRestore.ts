/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';

/**
 * Moves keyboard focus back to the element that opened a dialog, drawer or menu.
 *
 * Fluent moves focus asynchronously while a surface unmounts, so the focus call is
 * repeated on the next frame to make sure it is not overwritten. Elements that were
 * removed from the document in the meantime are ignored so focus is never forced onto
 * a detached node.
 */
export const restoreFocusTo = (element: HTMLElement | null | undefined): void => {
    if (!element || !element.isConnected) {
        return;
    }

    element.focus();

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => {
            if (element.isConnected) {
                element.focus();
            }
        });
    }
};

export interface FocusRestore {
    /** Remembers the element to return focus to. Defaults to the currently focused element. */
    captureInvoker(element?: HTMLElement | null): void;
    /** Returns focus to the previously captured element and clears it. */
    restoreFocus(): void;
}

/**
 * Tracks the control that triggered a transient surface so focus can be returned to it
 * on close, as required by WCAG 2.4.3 (Focus Order).
 */
export const useFocusRestore = (): FocusRestore => {
    const invokerRef = React.useRef<HTMLElement | null>(null);

    const captureInvoker = React.useCallback((element?: HTMLElement | null) => {
        invokerRef.current = element ?? (document.activeElement as HTMLElement | null);
    }, []);

    const restoreFocus = React.useCallback(() => {
        const invoker = invokerRef.current;
        invokerRef.current = null;
        restoreFocusTo(invoker);
    }, []);

    return { captureInvoker, restoreFocus };
};
