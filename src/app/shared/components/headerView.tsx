/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@fluentui/react';

export interface HeaderViewProps {
    headerText: string;
    className?: string;
    tooltip?: string;
    link?: string;
}

export const HeaderView: React.FC<HeaderViewProps> = props => {
    const { className, headerText, tooltip, link } = props;

    const { t } = useTranslation();
    return (
        <div style={{display: 'flex', alignItems: 'center'}} className={className ? className : ''}>
                <h3>{t(headerText)}</h3>
                <div style={{fontStyle: 'italic', paddingLeft: 15}}>
                    {tooltip && (link ? <Link href={t(link)} target="_blank">{t(tooltip)}</Link> : t(tooltip))}
                </div>
        </div>
    );
};
