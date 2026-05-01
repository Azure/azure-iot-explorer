/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Button, Label, Tooltip } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';
import '../../css/_labelWithTooltip.scss';

export interface LabelWithTooltipProps {
    tooltipText?: string;
    style?: React.CSSProperties;
    htmlFor?: string;
    children?: React.ReactNode;
    className?: string;
}

export const LabelWithTooltip = (props: LabelWithTooltipProps) => {
    const { tooltipText, style, children, htmlFor } = props;

    return (
        <div
            style={style}
            className="labelWithTooltip"
        >
            <Label weight="semibold" htmlFor={htmlFor}>
                {children}
            </Label>
            {tooltipText &&
                <Tooltip
                    content={tooltipText}
                    relationship="description"
                    positioning="after"
                >
                    <Button
                        appearance="subtle"
                        icon={<InfoRegular />}
                        aria-label="More information"
                    />
                </Tooltip>
            }
        </div>
    );
};
