/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NAV } from '../../constants/iconNames';

export interface CollapsibleButtonProps {
    appMenuVisible: boolean;
    setAppMenuVisible: (appMenuVisible: boolean) => void;
}

export const CollapsibleButton: React.FC<CollapsibleButtonProps> = props => {
    const { t } = useTranslation();

    const collapseToggle = () => {
        props.setAppMenuVisible(!props.appMenuVisible);
    };

    return (
        <IconButton
            className="collapsibleButton"
            tabIndex={0}
            iconProps={{ iconName: NAV }}
            title={props.appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
            ariaLabel={props.appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
            onClick={collapseToggle}
        />
    );
};
