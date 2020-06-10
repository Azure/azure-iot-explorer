/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TooltipHost, DirectionalHint } from 'office-ui-fabric-react/lib/components/Tooltip';
import { Stack } from 'office-ui-fabric-react/lib/components/Stack';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { getId } from 'office-ui-fabric-react/lib/Utilities';

export interface HeaderViewProps {
    headerText: string;
    tooltip?: string;
    link?: string;
}

export const HeaderView: React.FC<HeaderViewProps> = props => {
    const hostId = getId('tooltip');
    const { headerText, tooltip, link } = props;

    const { t } = useTranslation();
    return (
        <Stack horizontal={true}>
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
