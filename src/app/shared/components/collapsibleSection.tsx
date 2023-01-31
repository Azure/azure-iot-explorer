/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@fluentui/react';
import { LabelWithTooltip } from './labelWithTooltip';
import { GroupedList } from '../../constants/iconNames';
import { ResourceKeys } from '../../../localization/resourceKeys';
import './collapsibleSection.scss';

export interface CollapsibleSectionProps {
    expanded?: boolean;
    label: string;
    tooltipText: string;
    children: any; // tslint:disable-line: no-any
}

export interface CollapsibleSectionState {
    expanded: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = (props: CollapsibleSectionProps) => {
    const { t } = useTranslation();

    const { children, tooltipText, label } = props;
    const [ expanded, setExpanded ] = React.useState<boolean>(props.expanded);

    const toggleCollapse = () => setExpanded(!expanded);

    return (
        <div className="collapsible-section">
            <IconButton
                className="collapsible-section-icon"
                iconProps={{iconName: expanded ? GroupedList.CLOSE : GroupedList.OPEN}}
                ariaLabel={!expanded ?
                    `${t(ResourceKeys.collapsibleSection.open)} ${label}` :
                    `${t(ResourceKeys.collapsibleSection.close)} ${label}`}
                onClick={toggleCollapse}
                title={t(!expanded ? ResourceKeys.collapsibleSection.open : ResourceKeys.collapsibleSection.close)}
            />
            <LabelWithTooltip tooltipText={tooltipText}>
                {label}
            </LabelWithTooltip>
            <div className="collapsible-section-children">
                {expanded && children}
            </div>
        </div>
    );
};
