/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { LocalizationContextInterface, LocalizationContextConsumer } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import MaskedCopyableTextFieldContainer from '../../shared/components/maskedCopyableTextFieldContainer';
import { CANCEL } from '../../constants/iconNames';
import { RepositoryLocationSettings } from '../state';

export interface RepositoryLocationListItemProps {
    index: number;
    item: RepositoryLocationSettings;
    onPrivateRepositoryConnectionStringChanged: (connectionString: string) => void;
    onLocalFolderPathChanged: (path: string) => void;
    moveCard: (oldIndex: number, newIndex: number) => void;
    onRemoveListItem: (index: number) => void;
}

export default class RepositoryLocationListItem extends React.Component<RepositoryLocationListItemProps> {
    constructor(props: RepositoryLocationListItemProps) {
        super(props);
    }

    private readonly onRemove = () => {
        this.props.onRemoveListItem(this.props.index);
    }

    private renderItemDetail = (context: LocalizationContextInterface) => {
        const { item } = this.props;
        return (
            <div className="item-details">
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public
                    && context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label)}
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Device
                    && context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label)}
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private &&
                    <MaskedCopyableTextFieldContainer
                        ariaLabel={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.private.textBoxLabel)}
                        label={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.private.textBoxLabel)}
                        value={item.value}
                        allowMask={true}
                        readOnly={false}
                        required={true}
                        onTextChange={this.props.onPrivateRepositoryConnectionStringChanged}
                        placeholder={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.private.placeholder)}
                        setFocus={true}
                    />
                }
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local &&
                    <MaskedCopyableTextFieldContainer
                        ariaLabel={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.textBoxLabel)}
                        label={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.textBoxLabel)}
                        labelCallout={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.infoText)}
                        value={item.value}
                        allowMask={false}
                        readOnly={false}
                        required={true}
                        onTextChange={this.props.onLocalFolderPathChanged}
                        placeholder={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.placeholder)}
                        setFocus={true}
                    />
                }
            </div>);
    }

    public render(): JSX.Element {
        const { item, index } = this.props;
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                <div className="item" role="list">
                    <div className="numbering">
                        {index + 1}
                    </div>
                    <div
                        className="location-item"
                        role="listitem"
                    >
                        {this.renderItemDetail(context)}
                        {item.repositoryLocationType !== REPOSITORY_LOCATION_TYPE.Public && <IconButton
                            className="remove-button"
                            iconProps={{ iconName: CANCEL }}
                            title={context.t(ResourceKeys.settings.cancel)}
                            ariaLabel={context.t(ResourceKeys.settings.cancel)}
                            onClick={this.onRemove}
                        />}
                    </div>
                </div>
            )}
            </LocalizationContextConsumer>
        );
    }
}
