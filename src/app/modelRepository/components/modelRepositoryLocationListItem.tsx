/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/components/Button';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Dialog, DialogFooter } from 'office-ui-fabric-react/lib/components/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CANCEL, NAVIGATE_BACK, FOLDER } from '../../constants/iconNames';
import { fetchDirectories } from '../../api/services/localRepoService';
import { LabelWithRichCallout } from '../../shared/components/labelWithRichCallout';
import { getRootFolder, getParentFolder } from '../../shared/utils/utils';
import { RepositoryLocationSettings } from '../../shared/global/state';
import './modelRepositoryLocationListItem.scss';

export interface ModelRepositoryLocationListItemProps {
    errorKey?: string;
    index: number;
    item: RepositoryLocationSettings;
    onChangeRepositoryLocationSettingValue: (index: number, path: string) => void;
    onRemoveRepositoryLocationSetting: (index: number) => void;
}

export interface RepositoryLocationListItemState {
    currentFolder: string;
    subFolders: string[];
    showFolderPicker: boolean;
    showError: boolean;
}

export const ModelRepositoryLocationListItem: React.FC<ModelRepositoryLocationListItemProps> = (props: ModelRepositoryLocationListItemProps) => {
    const { t } = useTranslation();

    const { item, index, onChangeRepositoryLocationSettingValue, onRemoveRepositoryLocationSetting } = props;
    let initialCurrentFolder = '';
    if (item && item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local) {
        initialCurrentFolder = item.value || getRootFolder();
    }

    const [ subFolders, setSubFolders ] = React.useState([]);
    const [ currentFolder, setCurrentFolder ] = React.useState(initialCurrentFolder);
    const [ showError, setShowError ] = React.useState<boolean>(false);
    const [ showFolderPicker, setShowFolderPicker ] = React.useState<boolean>(false);

    const onRemove = () => onRemoveRepositoryLocationSetting(index);

    const renderItemDetail = () => {
        return (
            <div className="item-details">
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public
                    && <Label>{t(ResourceKeys.modelRepository.types.public.label)}</Label>}
                {item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local &&
                   renderLocalFolderItem()
                }
            </div>);
    };

    const renderLocalFolderItem = () => {
        return(
                <>
                    <div className="labelSection">
                        <LabelWithRichCallout
                            calloutContent={t(ResourceKeys.modelRepository.types.local.infoText)}
                            required={true}
                        >
                            {t(ResourceKeys.modelRepository.types.local.label)}
                        </LabelWithRichCallout>
                    </div>
                    <TextField
                        className="local-folder-textbox"
                        label={t(ResourceKeys.modelRepository.types.local.textBoxLabel)}
                        ariaLabel={t(ResourceKeys.modelRepository.types.local.textBoxLabel)}
                        value={currentFolder}
                        readOnly={false}
                        errorMessage={props.errorKey ? t(props.errorKey) : ''}
                        onChange={onFolderPathChange}
                    />
                    <DefaultButton
                        className="local-folder-launch"
                        text={t(ResourceKeys.modelRepository.types.local.folderPicker.command.openPicker)}
                        ariaLabel={t(ResourceKeys.modelRepository.types.local.folderPicker.command.openPicker)}
                        onClick={onShowFolderPicker}
                    />
                    {renderFolderPicker()}
                </>
            );
    };

    const onFolderPathChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCurrentFolder(newValue);
        onChangeRepositoryLocationSettingValue(index, newValue);
   };

    const onShowFolderPicker = () => {
        fetchSubDirectoriesInfo(currentFolder);
        setShowFolderPicker(true);
    };

    const dismissFolderPicker = () => {
        setCurrentFolder(item.value || getRootFolder());
        setShowFolderPicker(false);
    };

    const onSelectFolder = () => {
        onChangeRepositoryLocationSettingValue(index, currentFolder);
        setShowFolderPicker(false);
    };

    const onClickFolderName = (folder: string) => () => {
        const newDir = currentFolder ? `${currentFolder.replace(/\/$/, '')}/${folder}` : folder;
        setCurrentFolder(newDir);
        fetchSubDirectoriesInfo(newDir);
    };

    const onNavigateBack = () => {
        const parentFolder = getParentFolder(currentFolder);
        setCurrentFolder(parentFolder);
        fetchSubDirectoriesInfo(parentFolder);
    };

    const fetchSubDirectoriesInfo = (folderName: string) => {
        fetchDirectories(folderName).then(result => {
            setShowError(false);
            setSubFolders(result);
        }).catch(error => {
            setShowError(true);
        });
    };

    const renderFolderPicker = () => {
        return (
            <div role="dialog">
                <Dialog
                    className="folder-picker-dialog"
                    hidden={!showFolderPicker}
                    title={t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.title)}
                    subText={currentFolder && t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.subText, {folder: currentFolder})}
                    modalProps={{
                        isBlocking: false,
                    }}
                    onDismiss={dismissFolderPicker}
                >
                    <div className="folder-links">
                        <DefaultButton
                            className="folder-button"
                            iconProps={{ iconName: NAVIGATE_BACK }}
                            text={t(ResourceKeys.modelRepository.types.local.folderPicker.command.navigateToParent)}
                            ariaLabel={t(ResourceKeys.modelRepository.types.local.folderPicker.command.navigateToParent)}
                            onClick={onNavigateBack}
                            disabled={currentFolder === getRootFolder()}
                        />
                        {showError ? <div className="no-folders-text">{t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.error)}</div> :
                            subFolders && subFolders.length > 0 ?
                                subFolders.map(folder =>
                                    <DefaultButton
                                        className="folder-button"
                                        iconProps={{ iconName: FOLDER }}
                                        key={folder}
                                        text={folder}
                                        onClick={onClickFolderName(folder)}
                                    />)
                                :
                                <div className="no-folders-text">{t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.noFolderFoundText)}</div>}
                    </div>
                    <DialogFooter>
                        <PrimaryButton onClick={onSelectFolder} text={t(ResourceKeys.modelRepository.types.local.folderPicker.command.select)} disabled={!currentFolder}/>
                        <DefaultButton onClick={dismissFolderPicker} text={t(ResourceKeys.modelRepository.types.local.folderPicker.command.cancel)} />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    };

    return (
        <div className="item" role="list">
            <div className="numbering">
                {index + 1}
            </div>
            <div
                className="location-item"
                role="listitem"
            >
                {renderItemDetail()}
                <IconButton
                    className="remove-button"
                    iconProps={{ iconName: CANCEL }}
                    title={t(ResourceKeys.modelRepository.commands.remove.label)}
                    ariaLabel={t(ResourceKeys.modelRepository.commands.remove.ariaLabel)}
                    onClick={onRemove}
                />
            </div>
        </div>
    );
};
