/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@fluentui/react';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CANCEL } from '../../constants/iconNames';
import { ModelRepositoryConfiguration } from '../../shared/modelRepository/state';
import { ModelRepositoryFormType } from '../hooks/useModelRepositoryForm';
import { ListItemPublicRepo } from './listItemPublicRepo';
import { ListItemConfigurableRepo } from './listItemConfigurableRepo';
import { ListItemLocal } from './listItemLocal';
import './modelRepositoryLocationListItem.scss';

export interface ModelRepositoryLocationListItemProps {
    index: number;
    item: ModelRepositoryConfiguration;
    formState: ModelRepositoryFormType;
}

export const ModelRepositoryLocationListItem: React.FC<ModelRepositoryLocationListItemProps> = ({index, item, formState}) => {
    const { t } = useTranslation();
    const [{repositoryLocationSettings }, {setRepositoryLocationSettings, setDirtyFlag}] = formState;

    const onRemove = () => {
        const updatedRepositoryLocationSettings = [...repositoryLocationSettings];
        updatedRepositoryLocationSettings.splice(index, 1);

        setDirtyFlag(true);
        setRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const renderItemDetail = () => {
        return (
            <div className="item-details">
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public &&
                    <ListItemPublicRepo/>
                }
                {(item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local || item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.LocalDMR) &&
                    <ListItemLocal
                        index={index}
                        item={item}
                        formState={formState}
                        repoType={item.repositoryLocationType}
                    />
                }
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable &&
                    <ListItemConfigurableRepo
                        index={index}
                        item={item}
                        formState={formState}
                    />
                }
            </div>);
    };

    return (
        <div className="item" role="list">
            <div className="numbering">
                {index + 1}
            </div>
            <div
                className="location-item"
                role="listitem"
            >
                {renderItemDetail()}
                <IconButton
                    className="remove-button"
                    iconProps={{ iconName: CANCEL }}
                    title={t(ResourceKeys.modelRepository.commands.remove.label)}
                    ariaLabel={t(ResourceKeys.modelRepository.commands.remove.ariaLabel)}
                    onClick={onRemove}
                />
            </div>
        </div>
    );
};
