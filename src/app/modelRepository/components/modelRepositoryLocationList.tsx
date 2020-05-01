/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { RepositoryLocationSettings } from '../state';
import { LocalizationContextInterface, LocalizationContextConsumer } from '../../shared/contexts/localizationContext';
import ModelRepositoryLocationItem from './modelRepositoryLocationListItem';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

export interface ModelRepositoryLocationListProps {
    items: RepositoryLocationSettings[];
    onAddListItem: (type: REPOSITORY_LOCATION_TYPE) => void;
    onMoveItem: (oldIndex: number, newIndex: number) => void;
    onLocalFolderPathChanged: (path: string) => void;
    onRemoveListItem: (index: number) => void;
}

export default class RepositoryLocationList extends React.Component<ModelRepositoryLocationListProps> {
    constructor(props: ModelRepositoryLocationListProps) {
        super(props);
    }
    private readonly renderItem = (item: RepositoryLocationSettings, index: number) => {
        return (
                <Draggable key={item.repositoryLocationType} >
                    <ModelRepositoryLocationItem
                        {...this.props}
                        index={index}
                        item={item}
                        moveCard={this.props.onMoveItem}
                    />
                </Draggable>
        );
    }
    private readonly onDrop = (e: {addedIndex: number, removedIndex: number}) => {
        this.props.onMoveItem(e.removedIndex, e.addedIndex);
    }

    private readonly onAddRepositoryType = (type: REPOSITORY_LOCATION_TYPE) => {
        this.props.onAddListItem(type);
    }

    public render(): JSX.Element {
        const { items} = this.props;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => {
                    return(
                        <div className="location-list">
                            <Container onDrop={this.onDrop}>
                                {items && items.map((item, index) => this.renderItem(item, index))}
                            </Container>
                        </div>
                    );
                }}
            </LocalizationContextConsumer>
        );
    }
}
