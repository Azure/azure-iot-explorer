/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TooltipHost, DirectionalHint, Stack, IconButton, Link, getId } from '@fluentui/react';

export interface HeaderViewProps {
    headerText: string;
    className?: string;
    tooltip?: string;
    link?: string;
}

export const HeaderView: React.FC<HeaderViewProps> = props => {
    const hostId = getId('tooltip');
    const { className, headerText, tooltip, link } = props;

    const { t } = useTranslation();
    return (
        <Stack horizontal={true} className={className ? className : ''}>
            <Stack.Item align="start">
                <h3>{t(headerText)}</h3>
            </Stack.Item>

            {tooltip &&
                <Stack.Item align="center">
                    <TooltipHost
                        content={
                            link ?
                                <Link
                                    href={t(link)}
                                    target="_blank"
                                >
                                    {t(tooltip)}
                                </Link> :
                                t(tooltip)
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
