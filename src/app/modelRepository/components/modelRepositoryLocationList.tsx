/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { List, arrayMove, IItemProps, RenderListParams } from 'react-movable';
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

    const handleSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
        if (oldIndex !== newIndex) {
            const updatedRepositoryLocationSettings = arrayMove(
                repositoryLocationSettings,
                oldIndex,
                newIndex
            );
            setDirtyFlag(true);
            setRepositoryLocationSettings(updatedRepositoryLocationSettings);
        }
    };

    const renderItem = ({value, props}: {value: ModelRepositoryConfiguration, props: IItemProps} ) => (
        <div {...props} key={value.repositoryLocationType}>
            <ModelRepositoryLocationListItem
                item={value}
                index={repositoryLocationSettings.indexOf(value)}
                formState={formState}
            />
        </div>
    );

    const renderList = ({ children, props }: RenderListParams) => <div {...props}>{children}</div>;

    return (
        <div className="location-list">
            <List
                values={repositoryLocationSettings}
                onChange={handleSortEnd}
                renderList={renderList}
                renderItem={renderItem}
            />
        </div>
    );
};
