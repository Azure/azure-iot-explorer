/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { ArrowLeftRegular } from '@fluentui/react-icons';
import { ResourceKeys } from '../../../../localization/resourceKeys';

export interface BackButtonProps {
    backToSubscription: () => void;
    labelKey?: string;
}

export const BackButton: React.FC<BackButtonProps> = props => {
    const { t } = useTranslation();
    return (
        <Button appearance="transparent" icon={<ArrowLeftRegular />} onClick={props.backToSubscription}>
            {t(props.labelKey || ResourceKeys.authentication.azureActiveDirectory.hubList.backButton)}
        </Button>
    );
};
