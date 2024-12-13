/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { ModelRepositoryFormType } from '../hooks/useModelRepositoryForm';
import { ModelRepositoryConfiguration } from '../../shared/modelRepository/state';
import './modelRepositoryLocationList.scss';

export const ModelRepositoryLocationList: React.FC<{
    formState: ModelRepositoryFormType;
  }> = ({ formState }) => {
    const [
        { repositoryLocationSettings },
        { setRepositoryLocationSettings, setDirtyFlag },
    ] = formState;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => { // tslint:disable-line: no-any
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = repositoryLocationSettings.findIndex(
                item => item.repositoryLocationType === active.id
            );
            const newIndex = repositoryLocationSettings.findIndex(
                item => item.repositoryLocationType === over.id
            );

            const updatedRepositoryLocationSettings = arrayMove(
                repositoryLocationSettings,
                oldIndex,
                newIndex
            );

            setDirtyFlag(true);
            setRepositoryLocationSettings(updatedRepositoryLocationSettings);
        }
    };

    const SortableItem: React.FC<{ item: ModelRepositoryConfiguration, index: number }> = ({ item, index }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
        } = useSortable({ id: item.repositoryLocationType });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ModelRepositoryLocationListItem
                item={item}
                index={index}
                formState={formState}
            />
            </div>
        );
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={repositoryLocationSettings.map(
                    item => item.repositoryLocationType
                )}
            >
            <div className="location-list">
                {repositoryLocationSettings.map((item, index) => (
                    <SortableItem key={item.repositoryLocationType} item={item} index={index} />
                ))}
            </div>
            </SortableContext>
        </DndContext>
    );
};
