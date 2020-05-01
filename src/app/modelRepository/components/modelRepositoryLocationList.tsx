/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { RepositoryLocationSettings } from '../state';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import './modelRepositoryLocationList.scss';

export interface ModelRepositoryLocationListProps {
    repositoryLocationSettings: RepositoryLocationSettings[];
    onChangeRepositoryLocationSettings(settings: RepositoryLocationSettings[]): void;
}

export const ModelRepositoryLocationList: React.FC<ModelRepositoryLocationListProps> = props => {
    const { repositoryLocationSettings, onChangeRepositoryLocationSettings} = props;

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

    const renderModelRepositoryLocationListItem = (item: RepositoryLocationSettings, index: number) => {
        return (
                <Draggable key={item.repositoryLocationType} >
                    <ModelRepositoryLocationListItem
                        index={index}
                        item={item}
                        onLocalFolderPathChanged={undefined}
                        onRemoveListItem={onRemoveRepositoryLocationSetting}
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
