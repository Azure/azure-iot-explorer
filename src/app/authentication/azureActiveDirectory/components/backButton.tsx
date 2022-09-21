/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';

export interface BackButtonProps {
    backToSubscription: () => void;
}

export const BackButton: React.FC<BackButtonProps> = props => {
    const { t } = useTranslation();
    return (
        <ActionButton iconProps={{ iconName: 'back' }} onClick={props.backToSubscription}>
            {t(ResourceKeys.authentication.azureActiveDirectory.hubList.backButton)}
        </ActionButton>
    );
};
