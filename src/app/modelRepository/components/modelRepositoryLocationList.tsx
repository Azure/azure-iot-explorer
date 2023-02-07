/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { ModelRepositoryConfiguration } from '../../shared/modelRepository/state';
import { StringMap } from '../../api/models/stringMap';
import './modelRepositoryLocationList.scss';

export interface ModelRepositoryLocationListProps {
    repositoryLocationSettings: ModelRepositoryConfiguration[];
    repositoryLocationSettingsErrors: StringMap<string>;
    onChangeRepositoryLocationSettings(settings: ModelRepositoryConfiguration[]): void;
}

export const ModelRepositoryLocationList: React.FC<ModelRepositoryLocationListProps> = props => {
    const { repositoryLocationSettings, repositoryLocationSettingsErrors, onChangeRepositoryLocationSettings} = props;

    const onDrop = (e: {addedIndex: number, removedIndex: number}) => {
        const updatedRepositoryLocationSettings = [...repositoryLocationSettings];
        updatedRepositoryLocationSettings.splice(e.addedIndex, 0, updatedRepositoryLocationSettings.splice(e.removedIndex, 1)[0]);

        onChangeRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const onRemoveRepositoryLocationSetting = (index: number) => {
        const updatedRepositoryLocationSettings = [...props.repositoryLocationSettings];
        updatedRepositoryLocationSettings.splice(index, 1);

        onChangeRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const onChangeRepositoryLocationSettingValue = (index: number, value: string) => {
        const updatedRepositoryLocationSettings = repositoryLocationSettings.map((setting, i) => {
            if (i === index) {
                const updatedSetting = {...setting};
                updatedSetting.value = value;
                return updatedSetting;
            } else {
                return setting;
            }
        });

        onChangeRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const renderModelRepositoryLocationListItem = (item: ModelRepositoryConfiguration, index: number) => {
        return (
                <Draggable key={item.repositoryLocationType} >
                    <ModelRepositoryLocationListItem
                        index={index}
                        item={item}
                        errorKey={repositoryLocationSettingsErrors[item.repositoryLocationType]}
                        onChangeRepositoryLocationSettingValue={onChangeRepositoryLocationSettingValue}
                        onRemoveRepositoryLocationSetting={onRemoveRepositoryLocationSetting}
                    />
                </Draggable>
        );
    };

    return (
        <div className="location-list">
            <Container onDrop={onDrop}>
                {repositoryLocationSettings && repositoryLocationSettings.map((item, index) => renderModelRepositoryLocationListItem(item, index))}
            </Container>
        </div>
    );
};
