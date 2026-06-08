/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Button, Label, Popover, PopoverSurface, PopoverTrigger } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';
import '../../css/_labelWithTooltip.scss';

export interface LabelWithRichCalloutProps {
    calloutContent: React.JSX.Element;
    style?: React.CSSProperties;
    htmlFor?: string;
    children?: React.ReactNode;
}

export interface LabelWithRichCalloutState{
    showCallout: boolean;
}

export const LabelWithRichCallout: React.FC<LabelWithRichCalloutProps> = React.memo((props: LabelWithRichCalloutProps) => {
    const { calloutContent, style, children, htmlFor } = props;

    return (
        <div
            style={style}
            className="labelWithTooltip"
        >
            <Label weight="semibold" htmlFor={htmlFor}>
                {children}
            </Label>
            {calloutContent &&
                <Popover positioning="after" trapFocus>
                    <PopoverTrigger disableButtonEnhancement>
                        <Button
                            appearance="subtle"
                            icon={<InfoRegular />}
                            aria-label="More information"
                        />
                    </PopoverTrigger>
                    <PopoverSurface>
                        {calloutContent}
                    </PopoverSurface>
                </Popover>
            }
        </div>
    );
});
