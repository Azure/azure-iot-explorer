/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';

interface LiveRegionProps {
    message: string;
    politeness?: 'polite' | 'assertive';
}

/**
 * Accessibility live region that announces messages to screen readers.
 * Replaces v8 Announced component. Uses a key-based re-render trick
 * to ensure repeated identical messages are re-announced.
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({ message, politeness = 'polite' }) => {
    const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        if (message) {
            setCounter(c => c + 1);
        }
    }, [message]);

    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic="true"
            key={counter}
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
            }}
        >
            {message}
        </div>
    );
};
