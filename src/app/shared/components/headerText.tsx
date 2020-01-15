/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TooltipHost, DirectionalHint } from 'office-ui-fabric-react/lib/Tooltip';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { getId, Link } from 'office-ui-fabric-react';
import { LocalizationContextInterface } from '../contexts/localizationContext';

export const RenderHeaderText = (context: LocalizationContextInterface, headerText: string, tooltip?: string, link?: string) => {
    const hostId = getId('tooltip');
    return (
        <Stack horizontal={true}>
            <Stack.Item align="start">
                <h3> {context.t(headerText)}</h3>
            </Stack.Item>

            {tooltip &&
                <Stack.Item align="center">
                    <TooltipHost
                        content={
                            link ?
                                <Link
                                    href={context.t(link)}
                                    target="_blank"
                                >
                                    {context.t(tooltip)}
                                </Link> :
                                context.t(tooltip)
                        }
                        id={tooltip}
                        directionalHint={DirectionalHint.rightCenter}
                    >
                        <IconButton
                            iconProps={{ iconName: 'info' }}
                            aria-labelledby={hostId}
                        />
                    </TooltipHost>
                </Stack.Item>
            }

        </Stack>
    );
};
