/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';

/**
 * Fluent's DialogSurface closes the surrounding dialog or drawer on Escape unless the
 * key event has already been default-prevented. When focus is inside a text field that
 * means a single Escape tears down the whole dialog, losing any unsaved input, which
 * violates MAS 3.2.2.
 *
 * This hook returns handlers to spread onto an editable control so the first Escape is
 * absorbed - focus stays on the field - and a second consecutive Escape falls through to
 * the dialog and dismisses it. Typing, or moving focus elsewhere, resets the sequence.
 *
 * A single instance can be shared by several controls: the blur reset guarantees the
 * "second" Escape always belongs to the same field as the first.
 */
export const useEscapeGuard = () => {
    const escapeAbsorbedRef = React.useRef(false);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        if (event.key !== 'Escape') {
            escapeAbsorbedRef.current = false;
            return;
        }

        if (escapeAbsorbedRef.current) {
            escapeAbsorbedRef.current = false;
            return;
        }

        escapeAbsorbedRef.current = true;
        event.preventDefault();
    }, []);

    const onBlur = React.useCallback(() => {
        escapeAbsorbedRef.current = false;
    }, []);

    return { onKeyDown, onBlur };
};
