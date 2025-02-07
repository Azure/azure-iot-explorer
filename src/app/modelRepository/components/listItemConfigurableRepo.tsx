/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ModelRepositoryConfiguration } from '../../shared/modelRepository/state';
import { ModelRepositoryFormType } from '../hooks/useModelRepositoryForm';

export interface ListItemConfigurableRepoProps{
    index: number;
    item: ModelRepositoryConfiguration;
    formState: ModelRepositoryFormType;
}

export const ListItemConfigurableRepo: React.FC<ListItemConfigurableRepoProps> = ({index, item, formState}) => {
    const { t } = useTranslation();

    let initialConfigurableRepositoryPath = '';
    if (item && item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable) {
        initialConfigurableRepositoryPath = item.value;
    }

    return(
        <>
            <div className="labelSection">
                <div className="label">{t(ResourceKeys.modelRepository.types.configurable.label)}</div>
                <div className="description">{t(ResourceKeys.modelRepository.types.configurable.infoText)}</div>
                <MessageBar messageBarType={MessageBarType.warning}>
                    {t(ResourceKeys.modelRepository.types.configurable.warning)}
                </MessageBar>
            </div>
        </>
    );
};
