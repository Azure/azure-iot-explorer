/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DefaultButton, PrimaryButton, Dialog, DialogFooter, TextField, Link } from '@fluentui/react';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NAVIGATE_BACK, FOLDER } from '../../constants/iconNames';
import { fetchDirectories } from '../../api/services/localRepoService';
import { getRootFolder, getParentFolder } from '../../shared/utils/utils';
import { ModelRepositoryConfiguration, ModelRepositoryStateInterface } from '../../shared/modelRepository/state';
import { ModelRepositoryFormType } from '../hooks/useModelRepositoryForm';
import { validateRepositoryLocationSettings } from './commands';
import { ListItemLocalLabel } from './listItemLocalLabel';

export interface ListItemLocalProps {
    index: number;
    item: ModelRepositoryConfiguration;
    formState: ModelRepositoryFormType;
    repoType: REPOSITORY_LOCATION_TYPE;
}

// tslint:disable-next-line: cyclomatic-complexity
export const ListItemLocal: React.FC<ListItemLocalProps> = ({ item, index, repoType, formState }) => {
    const { t } = useTranslation();
    const [{repositoryLocationSettings, repositoryLocationSettingsErrors }, {setRepositoryLocationSettings, setRepositoryLocationSettingsErrors, setDirtyFlag}] = formState;
    const errorKey = repositoryLocationSettingsErrors[item.repositoryLocationType];

    let initialCurrentFolder = '';
    if (item && item.repositoryLocationType === repoType) {
        initialCurrentFolder = item.value || getRootFolder();
    }

    const [ subFolders, setSubFolders ] = React.useState([]);
    const [ currentFolder, setCurrentFolder ] = React.useState(initialCurrentFolder);
    const [ showError, setShowError ] = React.useState<boolean>(false);
    const [ showFolderPicker, setShowFolderPicker ] = React.useState<boolean>(false);

    React.useEffect(() => {
        setCurrentFolder(initialCurrentFolder);
    }, [initialCurrentFolder]); // tslint:disable-line: align

    const onChangeRepositoryLocationSettings = (updatedRepositoryLocationSettings: ModelRepositoryStateInterface) => {
        setDirtyFlag(true);
        setRepositoryLocationSettingsErrors(validateRepositoryLocationSettings(updatedRepositoryLocationSettings));
        setRepositoryLocationSettings([
            ...updatedRepositoryLocationSettings
        ]);
    };

    const onChangeRepositoryLocationSettingValue = (value: string) => {
        const updatedRepositoryLocationSettings = repositoryLocationSettings.map((setting, i) => {
            if (i === index) {
                const updatedSetting = {...setting};
                updatedSetting.value = value;
                return updatedSetting;
            } else {
                return setting;
            }
        });

        onChangeRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const onFolderPathChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCurrentFolder(newValue);
        onChangeRepositoryLocationSettingValue(newValue);
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
        onChangeRepositoryLocationSettingValue(currentFolder);
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
                    hidden={!showFolderPicker}
                    title={t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.title)}
                    modalProps={{
                        className: 'folder-picker-dialog',
                        isBlocking: false
                    }}
                    dialogContentProps={{
                        subText: currentFolder && t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.subText, {folder: currentFolder})
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

    return(
        <>
            <ListItemLocalLabel repoType={repoType}/>
            <TextField
                className="local-folder-textbox"
                label={t(ResourceKeys.modelRepository.types.local.textBoxLabel)}
                ariaLabel={t(ResourceKeys.modelRepository.types.local.textBoxLabel)}
                value={currentFolder}
                readOnly={false}
                errorMessage={errorKey ? t(errorKey) : ''}
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
