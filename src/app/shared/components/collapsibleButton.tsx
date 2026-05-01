/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { NavigationRegular } from '@fluentui/react-icons';
import { ResourceKeys } from '../../../localization/resourceKeys';

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
        <Button
            appearance="subtle"
            className="collapsibleButton"
            tabIndex={0}
            icon={<NavigationRegular />}
            title={props.appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
            aria-label={props.appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
            onClick={collapseToggle}
        />
    );
};
