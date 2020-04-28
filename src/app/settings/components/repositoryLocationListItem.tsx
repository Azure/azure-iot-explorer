/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton, DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import Dialog, { DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { LocalizationContextInterface, LocalizationContextConsumer } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import MaskedCopyableTextFieldContainer from '../../shared/components/maskedCopyableTextFieldContainer';
import { CANCEL, NAVIGATE_BACK, FOLDER } from '../../constants/iconNames';
import { RepositoryLocationSettings } from '../state';
import { fetchDirectories } from '../../api/services/localRepoService';
import LabelWithRichCallout from '../../shared/components/labelWithRichCallout';
import { getRootFolder, getParentFolder } from '../../shared/utils/utils';
import '../../css/_repositoryLocationItem.scss';

export interface RepositoryLocationListItemProps {
    index: number;
    item: RepositoryLocationSettings;
    onLocalFolderPathChanged: (path: string) => void;
    moveCard: (oldIndex: number, newIndex: number) => void;
    onRemoveListItem: (index: number) => void;
}

export interface RepositoryLocationListItemState {
    currentFolder: string;
    subFolders: string[];
    showFolderPicker: boolean;
    showError: boolean;
}

export default class RepositoryLocationListItem extends React.Component<RepositoryLocationListItemProps, RepositoryLocationListItemState> {
    constructor(props: RepositoryLocationListItemProps) {
        super(props);
        let currentFolder = '';
        if (this.props.item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local) {
            currentFolder = this.props.item.value || getRootFolder();
        }

        this.state = {
            currentFolder,
            showError: false,
            showFolderPicker: false,
            subFolders: []
        };
    }

    private readonly onRemove = () => {
        this.props.onRemoveListItem(this.props.index);
    }

    private renderItemDetail = (context: LocalizationContextInterface) => {
        const { item } = this.props;
        return (
            <div className="item-details">
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public
                    && <Label>{context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label)}</Label>}
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Device
                    &&  <Label>{context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label)}</Label>}
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local &&
                   this.renderLocalFolderItem(context)
                }
            </div>);
    }

    private renderLocalFolderItem = (context: LocalizationContextInterface) => {
        return(
                <>
                    <div className="labelSection">
                        <LabelWithRichCallout
                            calloutContent={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.infoText)}
                            required={true}
                        >
                            {context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.label)}
                        </LabelWithRichCallout>
                    </div>
                    <TextField
                        className="local-folder-textbox"
                        label={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.textBoxLabel)}
                        ariaLabel={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.textBoxLabel)}
                        value={this.state.currentFolder}
                        readOnly={true}
                    />
                    <DefaultButton
                        text={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.command.openPicker)}
                        ariaLabel={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.command.openPicker)}
                        onClick={this.onShowFolderPicker}
                    />
                    {this.renderFolderPicker(context)}
                </>
            );
    }

    private onShowFolderPicker = () => {
        this.setState({showFolderPicker: true});
        this.fetchSubDirectoriesInfo(this.state.currentFolder);
    }

    private dismissFolderPicker = () => {
        this.setState({
            currentFolder: this.props.item.value || getRootFolder(),
            showFolderPicker: false
        });
    }

    private onSelectFolder = () => {
        this.props.onLocalFolderPathChanged(this.state.currentFolder);
        this.setState({showFolderPicker: false});
    }

    private onClickFolderName = (folder: string) => () => {
        const newDir = this.state.currentFolder ? `${this.state.currentFolder.replace(/\/$/, '')}/${folder}` : folder;
        this.setState({currentFolder: newDir});
        this.fetchSubDirectoriesInfo(newDir);
    }

    private onNavigateBack = () => {
        const parentFolder = getParentFolder(this.state.currentFolder);
        this.setState({currentFolder: parentFolder});
        this.fetchSubDirectoriesInfo(parentFolder);
    }

    private fetchSubDirectoriesInfo = (folderName: string) => {
        fetchDirectories(folderName).then(result => this.setState({showError: false, subFolders: result})).catch(error => {this.setState({showError: true}); });
    }

    private renderFolderPicker = (context: LocalizationContextInterface) => {
        return (
            <div role="dialog">
                <Dialog
                    className="folder-picker-dialog"
                    hidden={!this.state.showFolderPicker}
                    title={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.dialog.title)}
                    subText={this.state.currentFolder && context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.dialog.subText, {folder: this.state.currentFolder})}
                    modalProps={{
                        isBlocking: false,
                    }}
                    onDismiss={this.dismissFolderPicker}
                >
                    <div className="folder-links">
                        <DefaultButton
                            className="folder-button"
                            iconProps={{ iconName: NAVIGATE_BACK }}
                            text={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.command.navigateToParent)}
                            ariaLabel={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.command.navigateToParent)}
                            onClick={this.onNavigateBack}
                            disabled={this.state.currentFolder === getRootFolder()}
                        />
                        {this.state.showError ? <div className="no-folders-text">{context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.dialog.error)}</div> :
                            this.state.subFolders && this.state.subFolders.length > 0 ?
                                this.state.subFolders.map(folder =>
                                    <DefaultButton
                                        className="folder-button"
                                        iconProps={{ iconName: FOLDER }}
                                        key={folder}
                                        text={folder}
                                        onClick={this.onClickFolderName(folder)}
                                    />)
                                :
                                <div className="no-folders-text">{context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.dialog.noFolderFoundText)}</div>}
                    </div>
                    <DialogFooter>
                        <PrimaryButton onClick={this.onSelectFolder} text={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.command.select)} disabled={!this.state.currentFolder}/>
                        <DefaultButton onClick={this.dismissFolderPicker} text={context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.folderPicker.command.cancel)} />
                    </DialogFooter>
                </Dialog>
            </div>
        );
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
                        <IconButton
                            className="remove-button"
                            iconProps={{ iconName: CANCEL }}
                            title={context.t(ResourceKeys.settings.cancel)}
                            ariaLabel={context.t(ResourceKeys.settings.cancel)}
                            onClick={this.onRemove}
                        />
                    </div>
                </div>
            )}
            </LocalizationContextConsumer>
        );
    }
}
