/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Field, Input, Link } from '@fluentui/react-components';
import { ArrowLeftRegular, FolderOpenRegular } from '@fluentui/react-icons';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { fetchDirectories } from '../../api/services/localRepoService';
import { getRootFolder, getParentFolder } from '../../shared/utils/utils';
import { ModelRepositoryConfiguration } from '../../shared/modelRepository/state';
import { ModelRepositoryFormType } from '../hooks/useModelRepositoryForm';
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
    const [{repositoryLocationSettings, repositoryLocationSettingsErrors }, {setRepositoryLocationSettings, setDirtyFlag}] = formState;
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

        setDirtyFlag(true);
        setRepositoryLocationSettings(updatedRepositoryLocationSettings);
    };

    const onFolderPathChange = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
        setCurrentFolder(data.value);
        onChangeRepositoryLocationSettingValue(data.value);
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
            <Dialog
                open={showFolderPicker}
                onOpenChange={(e, data) => { if (!data.open) dismissFolderPicker(); }}
            >
                <DialogSurface className="folder-picker-dialog">
                    <DialogBody>
                        <DialogTitle>{t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.title)}</DialogTitle>
                        <DialogContent>
                            {currentFolder && <div>{t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.subText, {folder: currentFolder})}</div>}
                            <div className="folder-links">
                                <Button
                                    className="folder-button"
                                    icon={<ArrowLeftRegular />}
                                    aria-label={t(ResourceKeys.modelRepository.types.local.folderPicker.command.navigateToParent)}
                                    onClick={onNavigateBack}
                                    disabled={currentFolder === getRootFolder()}
                                >
                                    {t(ResourceKeys.modelRepository.types.local.folderPicker.command.navigateToParent)}
                                </Button>
                                {showError ? <div className="no-folders-text">{t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.error)}</div> :
                                    subFolders && subFolders.length > 0 ?
                                        subFolders.map(folder =>
                                            <Button
                                                className="folder-button"
                                                icon={<FolderOpenRegular />}
                                                key={folder}
                                                onClick={onClickFolderName(folder)}
                                            >
                                                {folder}
                                            </Button>)
                                        :
                                        <div className="no-folders-text">{t(ResourceKeys.modelRepository.types.local.folderPicker.dialog.noFolderFoundText)}</div>}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="primary" onClick={onSelectFolder} disabled={!currentFolder}>{t(ResourceKeys.modelRepository.types.local.folderPicker.command.select)}</Button>
                            <Button onClick={dismissFolderPicker}>{t(ResourceKeys.modelRepository.types.local.folderPicker.command.cancel)}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        );
    };

    return(
        <>
            <ListItemLocalLabel repoType={repoType}/>
            <Field
                label={t(ResourceKeys.modelRepository.types.local.textBoxLabel)}
                validationMessage={errorKey ? t(errorKey) : undefined}
                validationState={errorKey ? 'error' : 'none'}
            >
                <Input
                    className="local-folder-textbox"
                    aria-label={t(ResourceKeys.modelRepository.types.local.textBoxLabel)}
                    value={currentFolder}
                    readOnly={false}
                    onChange={onFolderPathChange}
                />
            </Field>
            <div style={{ marginTop: 10, overflow: 'hidden' }}>
                <Button
                    className="local-folder-launch"
                    aria-label={t(ResourceKeys.modelRepository.types.local.folderPicker.command.openPicker)}
                    onClick={onShowFolderPicker}
                >
                    {t(ResourceKeys.modelRepository.types.local.folderPicker.command.openPicker)}
                </Button>
            </div>
            {renderFolderPicker()}
        </>
    );
};
