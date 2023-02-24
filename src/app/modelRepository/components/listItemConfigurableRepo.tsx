/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@fluentui/react';
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
    const [{repositoryLocationSettings, repositoryLocationSettingsErrors }, {setRepositoryLocationSettings, setDirtyFlag}] = formState;
    const errorKey = repositoryLocationSettingsErrors[item.repositoryLocationType];

    let initialConfigurableRepositoryPath = '';
    if (item && item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable) {
        initialConfigurableRepositoryPath = item.value;
    }
    const [ currentConfigurableRepositoryPath, setCurrentConfigurableRepositoryPath ] = React.useState(initialConfigurableRepositoryPath);

    React.useEffect(() => {
        setCurrentConfigurableRepositoryPath(initialConfigurableRepositoryPath);
    }, [initialConfigurableRepositoryPath]); // tslint:disable-line: align

    const onChangeRepositoryLocationSettingValue = (value: string) => {
        const updatedRepositoryLocationSettings = repositoryLocationSettings.map((setting, i) => {
            if (i === index) {
                const updatedSetting = {...setting};
                updatedSetting.value = value;
                return updatedSetting;
            } else {
                return setting;
            }
        });

        setDirtyFlag(true);
        setRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const repositoryEndpointChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCurrentConfigurableRepositoryPath(newValue);
        onChangeRepositoryLocationSettingValue(newValue);
    };

    return(
        <>
            <div className="labelSection">
                <div className="label">{t(ResourceKeys.modelRepository.types.configurable.label)}</div>
                <div className="description">{t(ResourceKeys.modelRepository.types.configurable.infoText)}</div>
            </div>
            <TextField
                className="local-folder-textbox"
                label={t(ResourceKeys.modelRepository.types.configurable.textBoxLabel)}
                ariaLabel={t(ResourceKeys.modelRepository.types.configurable.textBoxLabel)}
                value={currentConfigurableRepositoryPath}
                readOnly={false}
                errorMessage={errorKey ? t(errorKey) : ''}
                onChange={repositoryEndpointChange}
                prefix="https://"
            />
        </>
    );
};
