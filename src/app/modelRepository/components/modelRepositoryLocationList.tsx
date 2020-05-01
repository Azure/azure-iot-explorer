/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { RepositoryLocationSettings } from '../state';
import { LocalizationContextInterface, LocalizationContextConsumer } from '../../shared/contexts/localizationContext';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import './modelRepositoryLocationList.scss';

export interface ModelRepositoryLocationListProps {
    repositoryLocationSettings: RepositoryLocationSettings[];
    onChangeRepositoryLocationSettings(settings: RepositoryLocationSettings[]): void;
}

export default class RepositoryLocationList extends React.Component<ModelRepositoryLocationListProps> {
    constructor(props: ModelRepositoryLocationListProps) {
        super(props);
    }
    private readonly renderItem = (item: RepositoryLocationSettings, index: number) => {
        return (
                <Draggable key={item.repositoryLocationType} >
                    <ModelRepositoryLocationListItem
                        index={index}
                        item={item}
                        onLocalFolderPathChanged={undefined}
                        onRemoveListItem={this.onRemoveRepositoryLocationSetting}
                    />
                </Draggable>
        );
    }
    private readonly onDrop = (e: {addedIndex: number, removedIndex: number}) => {
        const updatedRepositoryLocationSettings = [...this.props.repositoryLocationSettings];
        updatedRepositoryLocationSettings.splice(e.addedIndex, 0, updatedRepositoryLocationSettings.splice(e.removedIndex, 1)[0]);

        this.props.onChangeRepositoryLocationSettings(updatedRepositoryLocationSettings);
    }

    private readonly onRemoveRepositoryLocationSetting = (index: number) => {
        const updatedRepositoryLocationSettings = [...this.props.repositoryLocationSettings];
        updatedRepositoryLocationSettings.splice(index, 1);

        this.props.onChangeRepositoryLocationSettings(updatedRepositoryLocationSettings);
    }

    public render(): JSX.Element {
        const { repositoryLocationSettings } = this.props;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => {
                    return(
                        <div className="location-list">
                            <Container onDrop={this.onDrop}>
                                {repositoryLocationSettings && repositoryLocationSettings.map((item, index) => this.renderItem(item, index))}
                            </Container>
                        </div>
                    );
                }}
            </LocalizationContextConsumer>
        );
    }
}
