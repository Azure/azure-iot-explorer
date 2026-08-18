/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';

/** How long to keep re-asserting focus while a surface plays its exit motion. */
const FOCUS_RESTORE_TIMEOUT_MS = 500;

/**
 * Moves keyboard focus back to the element that opened a dialog, drawer or menu.
 *
 * Fluent keeps a modal surface mounted - with tabster's focus trap still active - while it
 * plays its exit motion, and the trap pulls focus back inside for as long as it is up. A
 * single focus() call therefore gets undone. Focus is re-asserted on each animation frame
 * until it sticks, or until a short deadline passes so a permanently unfocusable target
 * cannot spin forever. Elements removed from the document are ignored so focus is never
 * forced onto a detached node.
 */
export const restoreFocusTo = (element: HTMLElement | null | undefined): void => {
    if (!element || !element.isConnected) {
        return;
    }

    element.focus();

    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
        return;
    }

    const deadline = Date.now() + FOCUS_RESTORE_TIMEOUT_MS;
    const retry = () => {
        if (!element.isConnected) {
            return;
        }

        if (element.ownerDocument?.activeElement !== element) {
            element.focus();
        }

        // Keep polling rather than stopping at the first success: the trap can steal focus
        // back on a later frame, at any point until the surface finishes unmounting.
        if (Date.now() < deadline) {
            window.requestAnimationFrame(retry);
        }
    };

    window.requestAnimationFrame(retry);
};

export interface FocusRestoreOnClose {
    /**
     * Suppresses the focus restore for the next close only. Use when closing is followed by
     * navigation, or by removing the invoker, where returning focus to it makes no sense.
     */
    skipNextRestore(): void;
}

/**
 * Returns focus to the control that opened a transient surface once that surface has
 * actually closed, as required by WCAG 2.4.3 (Focus Order).
 *
 * The restore runs from an effect keyed on the open flag rather than from the click
 * handler, so focus is never moved while the surface is still open and holding a focus
 * trap - doing that both fails to stick and briefly focuses an element hidden behind a
 * modal.
 *
 * @param isOpen whether the surface is currently open
 * @param getInvoker resolves the element to focus; read at close time, so a surface shared
 *                   by several controls can return focus to whichever one opened it
 */
export const useFocusRestoreOnClose = (
    isOpen: boolean,
    getInvoker: () => HTMLElement | null | undefined
): FocusRestoreOnClose => {
    const wasOpenRef = React.useRef<boolean>(isOpen);
    const skipRef = React.useRef<boolean>(false);
    const getInvokerRef = React.useRef(getInvoker);
    getInvokerRef.current = getInvoker;

    React.useEffect(() => {
        const wasOpen = wasOpenRef.current;
        wasOpenRef.current = isOpen;

        if (!wasOpen || isOpen) {
            return;
        }

        if (skipRef.current) {
            skipRef.current = false;
            return;
        }

        restoreFocusTo(getInvokerRef.current());
    }, [isOpen]);

    const skipNextRestore = React.useCallback(() => {
        skipRef.current = true;
    }, []);

    return { skipNextRestore };
};
