/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TooltipHost, DirectionalHint } from 'office-ui-fabric-react/lib/Tooltip';
import { Label, ILabelProps } from 'office-ui-fabric-react/lib/Label';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { INFO } from '../../constants/iconNames';
import '../../css/_labelWithTooltip.scss';

export interface LabelWithTooltipProps extends ILabelProps {
    tooltipText?: string;
}

export default (props: LabelWithTooltipProps) => {
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
                        ariaLabel={INFO}
                        aria-labelledby={hostId}
                        id={buttonId}
                    />
                </TooltipHost>
            }
        </div>
    );
};
