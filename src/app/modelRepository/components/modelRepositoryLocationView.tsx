/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CommandBar, ICommandBarItemProps,  } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { getRepositoryLocationSettingsSelector } from '../selectors';
import { RepositoryLocationSettings } from '../state';
import { StateInterface } from '../../shared/redux/state';
import { setRepositoryLocationsAction } from '../actions';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ModelRepositoryLocationList } from './modelRepositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import '../../css/_layouts.scss';

export interface ModelRepositoryLocationViewDataProps {
    repositoryLocationSettings: RepositoryLocationSettings[];
}

export interface ModelRepositoryLocationViewActionProps {
    onSaveRepositoryLocationSettings(modelRepositorySettings: RepositoryLocationSettings[]): void;
}

export type ModelRepositoryLocationViewProps = ModelRepositoryLocationViewDataProps & ModelRepositoryLocationViewActionProps;

export const ModelRepositoryLocationView: React.FC<ModelRepositoryLocationViewProps> = props => {
    const [ repositoryLocationSettings, setRepositoryLocationSettings ] = React.useState<RepositoryLocationSettings[]>(props.repositoryLocationSettings);
    const [ dirty, setDirtyFlag ] = React.useState<boolean>(false);
    const { t } = useLocalizationContext();

    const onSaveModelRepositorySettingsClick = () => {
        props.onSaveRepositoryLocationSettings(repositoryLocationSettings);
        setDirtyFlag(false);
    };

    const getCommandBarItems = (): ICommandBarItemProps[] => {
        const addItems = getCommandBarItemsAdd();

        return [
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.save.ariaLabel),
                disabled: !dirty,
                iconProps: { iconName: 'Save' },
                key: 'save',
                onClick: onSaveModelRepositorySettingsClick,
                text: t(ResourceKeys.modelRepository.commands.save.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.revert.ariaLabel),
                disabled: !dirty,
                iconProps: { iconName: 'Undo' },
                key: 'revert',
                onClick: onRevertModelRepositorySettingsClick,
                text: t(ResourceKeys.modelRepository.commands.revert.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.add.ariaLabel),
                disabled: repositoryLocationSettings.length >= Object.keys(REPOSITORY_LOCATION_TYPE).length,
                iconProps: { iconName: 'Add'},
                key: 'add',
                subMenuProps: {
                    items: addItems
                },
                text: t(ResourceKeys.modelRepository.commands.add.label)
            }
        ];
    };

    const getCommandBarItemsAdd = (): IContextualMenuItem[] => {
        const hostModeNotElectron: boolean = appConfig.hostMode !== HostMode.Electron;

        return [
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addPublicSource.ariaLabel),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public),
                key: REPOSITORY_LOCATION_TYPE.Public,
                onClick: onAddRepositoryLocationPublic,
                text: t(ResourceKeys.modelRepository.commands.addPublicSource.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addDeviceSource.ariaLabel),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Device),
                key: REPOSITORY_LOCATION_TYPE.Device,
                onClick: onAddRepositoryLocationDevice,
                text: t(ResourceKeys.modelRepository.commands.addDeviceSource.label),
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addLocalSource.ariaLabel),
                disabled: hostModeNotElectron || repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local),
                key: REPOSITORY_LOCATION_TYPE.Local,
                onClick: onAddRepositoryLocationLocal,
                text: t(hostModeNotElectron ?
                    ResourceKeys.modelRepository.commands.addLocalSource.labelInBrowser :
                    ResourceKeys.modelRepository.commands.addLocalSource.label)
            }
        ];
    };

    const onRevertModelRepositorySettingsClick = () => {
        setDirtyFlag(false);
        setRepositoryLocationSettings(props.repositoryLocationSettings);
    };

    const onAddRepositoryLocationPublic = () => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...repositoryLocationSettings,
            {
               repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public
            }
        ]);
    };

    const onAddRepositoryLocationLocal = () => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...repositoryLocationSettings,
            {
               repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local
            }
        ]);
    };

    const onAddRepositoryLocationDevice = () => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...repositoryLocationSettings,
            {
               repositoryLocationType: REPOSITORY_LOCATION_TYPE.Device
            }
        ]);
    };

    const onChangeRepositoryLocationSettings = (updatedRepositoryLocationSettings: RepositoryLocationSettings[]) => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...updatedRepositoryLocationSettings
        ]);
    };

    return (
        <div className="view">
            <div className="view-command">
                <CommandBar items={getCommandBarItems()} />
            </div>
            <div className="view-content view-scroll-vertical">
                <ModelRepositoryLocationList
                    repositoryLocationSettings={repositoryLocationSettings}
                    onChangeRepositoryLocationSettings={onChangeRepositoryLocationSettings}
                />
            </div>
        </div>
    );
};

export const ModelRepositoryLocationViewContainer: React.FC = () => {
    const reduxState = useSelector((state: StateInterface) => state);
    const dispatch = useDispatch();
    const modelRepositorySettings = getRepositoryLocationSettingsSelector(reduxState) || [];
    const onSaveModelRepositorySettings = (repositoryLocationSettings: RepositoryLocationSettings[]) => {
        dispatch(setRepositoryLocationsAction(repositoryLocationSettings));
    };

    return (
        <ModelRepositoryLocationView
            repositoryLocationSettings={modelRepositorySettings}
            onSaveRepositoryLocationSettings={onSaveModelRepositorySettings}
        />
    );
};
