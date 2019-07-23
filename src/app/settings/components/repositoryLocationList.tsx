/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { CommandButton } from 'office-ui-fabric-react/lib/Button';
import { RepositoryLocationSettings } from '../state';
import { LocalizationContextInterface, LocalizationContextConsumer } from '../../shared/contexts/localizationContext';
import RepositoryLocationItem from './repositoryLocationListItem';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

export interface RepositoryLocationListProps {
    items: RepositoryLocationSettings[];
    onAddListItem: (type: REPOSITORY_LOCATION_TYPE) => void;
    onMoveItem: (oldIndex: number, newIndex: number) => void;
    onPrivateRepositoryConnectionStringChanged: (connectionString: string) => void;
    onRemoveListItem: (index: number) => void;
}

export default class RepositoryLocationList extends React.Component<RepositoryLocationListProps> {
    constructor(props: RepositoryLocationListProps) {
        super(props);
    }
    private readonly renderItem = (item: RepositoryLocationSettings, index: number) => {
        return (
                <Draggable key={item.repositoryLocationType} >
                    <RepositoryLocationItem
                        index={index}
                        item={item}
                        moveCard={this.props.onMoveItem}
                        onPrivateRepositoryConnectionStringChanged={this.props.onPrivateRepositoryConnectionStringChanged}
                        onRemoveListItem={this.props.onRemoveListItem}
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
                    const menuItems = [
                        {
                            disabled: !items || items.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private),
                            key: REPOSITORY_LOCATION_TYPE.Private,
                            onClick: () => this.onAddRepositoryType(REPOSITORY_LOCATION_TYPE.Private),
                            text: context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.private.label)
                        },
                        {
                            disabled: !items || items.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public),
                            key: REPOSITORY_LOCATION_TYPE.Public,
                            onClick: () => this.onAddRepositoryType(REPOSITORY_LOCATION_TYPE.Public),
                            text: context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label)
                        },
                        {
                            disabled: !items || items.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Device),
                            key: REPOSITORY_LOCATION_TYPE.Device,
                            onClick: () => this.onAddRepositoryType(REPOSITORY_LOCATION_TYPE.Device),
                            text: context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label),
                        }
                    ];
                    return(
                        <div className="location-list">
                            <Container onDrop={this.onDrop}>
                                {items && items.map((item, index) => this.renderItem(item, index))}
                            </Container>
                            <CommandButton
                                iconProps={{iconName: 'Add'}}
                                text={context.t(ResourceKeys.settings.modelDefinitions.add)}
                                menuProps={{
                                    items: menuItems,
                                }}
                                disabled={!menuItems.some(item => !item.disabled)}
                            />
                        </div>
                    );
                }}
            </LocalizationContextConsumer>
        );
    }
}
