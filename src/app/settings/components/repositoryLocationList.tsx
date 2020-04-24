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
import { ADD } from '../../constants/iconNames';
import { appConfig, HostMode } from '../../../appConfig/appConfig';

export interface RepositoryLocationListProps {
    items: RepositoryLocationSettings[];
    onAddListItem: (type: REPOSITORY_LOCATION_TYPE) => void;
    onMoveItem: (oldIndex: number, newIndex: number) => void;
    onLocalFolderPathChanged: (path: string) => void;
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

    private readonly getMenuItems = (context: LocalizationContextInterface) => {
        const { items} = this.props;
        return [
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
            },
            this.getLocalMenuItem(context)
        ];
    }

    private readonly getLocalMenuItem = (context: LocalizationContextInterface) => {
        const { items} = this.props;
        return {
            disabled: appConfig.hostMode !== HostMode.Electron || !items || items.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local),
            key: REPOSITORY_LOCATION_TYPE.Local,
            onClick: () => this.onAddRepositoryType(REPOSITORY_LOCATION_TYPE.Local),
            text: context.t(appConfig.hostMode === HostMode.Electron ?
                ResourceKeys.settings.modelDefinitions.repositoryTypes.local.label :
                ResourceKeys.settings.modelDefinitions.repositoryTypes.local.labelInBrowser),
        };
    }

    public render(): JSX.Element {
        const { items} = this.props;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => {
                    const menuItems = this.getMenuItems(context);
                    return(
                        <div className="location-list">
                            <Container onDrop={this.onDrop}>
                                {items && items.map((item, index) => this.renderItem(item, index))}
                            </Container>
                            <CommandButton
                                iconProps={{iconName: ADD}}
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
