/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TooltipHost, DirectionalHint, Label, ILabelProps, IconButton, getId } from '@fluentui/react';
import { INFO } from '../../constants/iconNames';
import '../../css/_labelWithTooltip.scss';

export interface LabelWithTooltipProps extends ILabelProps {
    tooltipText?: string;
}

export const LabelWithTooltip = (props: LabelWithTooltipProps) => {
    const { tooltipText, style } = props;

    const buttonId = getId('iconbutton');
    const hostId = getId('tooltip');

    return (
        <div
            style={style}
            className="labelWithTooltip"
        >
            <Label
                {...props}
            />
            {tooltipText &&
                <TooltipHost
                    content={tooltipText}
                    calloutProps={{
                        gapSpace: 0,
                        target: `#${buttonId}`
                    }}
                    id={hostId}
                    directionalHint={DirectionalHint.rightCenter}
                >
                    <IconButton
                        iconProps={{ iconName: INFO }}
                        aria-labelledby={hostId}
                        id={buttonId}
                    />
                </TooltipHost>
            }
        </div>
    );
};
