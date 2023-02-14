/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { ModelRepositoryConfiguration } from '../../shared/modelRepository/state';
import { ModelRepositoryFormType } from '../hooks/useModelRepositoryForm';
import './modelRepositoryLocationList.scss';

export const ModelRepositoryLocationList: React.FC<{formState: ModelRepositoryFormType}> = ({formState}) => {
    const[{ repositoryLocationSettings }, {setRepositoryLocationSettings, setDirtyFlag}] = formState;

    const onDrop = (e: {addedIndex: number, removedIndex: number}) => {
        const updatedRepositoryLocationSettings = [...repositoryLocationSettings];
        updatedRepositoryLocationSettings.splice(e.addedIndex, 0, updatedRepositoryLocationSettings.splice(e.removedIndex, 1)[0]);

        setDirtyFlag(true);
        setRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const renderModelRepositoryLocationListItem = (item: ModelRepositoryConfiguration, index: number) => {
        return (
            <Draggable key={item.repositoryLocationType} >
                <ModelRepositoryLocationListItem
                    index={index}
                    item={item}
                    formState={formState}
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
