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
import { ResourceKeys } from '../../../localization/resourceKeys';
import ModelRepositoryLocationList from './modelRepositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import '../../css/_layouts.scss';

export interface ModelRepositoriesViewDataProps {
    repositoryLocationSettings: RepositoryLocationSettings[];
}

export interface ModelRepositoriesViewActionProps {
    onSaveRepositoryLocationSettings(modelRepositorySettings: RepositoryLocationSettings[]): void;
}

export type ModelRepositoriesViewProps = ModelRepositoriesViewDataProps & ModelRepositoriesViewActionProps;

export const ModelRepositoriesView: React.FC<ModelRepositoriesViewProps> = props => {
    const [ repositoryLocationSettings, setRepositoryLocationSettings ] = React.useState<RepositoryLocationSettings[]>(props.repositoryLocationSettings);
    const [ dirty, setDirtyFlag ] = React.useState<boolean>(false);
    const { t } = useLocalizationContext();

    const onSaveModelRepositorySettingsClick = () => {
        throw new Error('not implemented');
    };

    const getCommandBarItems = (): ICommandBarItemProps[] => {
        const addItems = getCommandBarItemsAdd();

        return [
            {
                ariaLabel: t(ResourceKeys.connectionStrings.addConnectionCommand.ariaLabel),
                disabled: !dirty,
                iconProps: { iconName: 'Save' },
                key: 'save',
                onClick: onSaveModelRepositorySettingsClick,
                text: 'Save'
            },
            {
                ariaLabel: '',
                iconProps: { iconName: 'Add'},
                key: 'add',
                subMenuProps: {
                    items: addItems
                },
                text: 'Add',
            }
        ];
    };

    const getCommandBarItemsAdd = (): IContextualMenuItem[] => {
        const hostModeNotElectron: boolean = appConfig.hostMode !== HostMode.Electron;

        return [
            {
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public),
                key: REPOSITORY_LOCATION_TYPE.Public,
                onClick: onAddRepositoryLocationPublic,
                text: t(ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label)
            },
            {
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Device),
                key: REPOSITORY_LOCATION_TYPE.Device,
                onClick: onAddRepositoryLocationDevice,
                text: t(ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label),
            },
            {
                disabled: hostModeNotElectron || repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local),
                key: REPOSITORY_LOCATION_TYPE.Local,
                onClick: onAddRepositoryLocationLocal,
                text: t(hostModeNotElectron ?
                    ResourceKeys.settings.modelDefinitions.repositoryTypes.local.labelInBrowser :
                    ResourceKeys.settings.modelDefinitions.repositoryTypes.local.label)
            }
        ];
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

export const ModelRepositoriesViewContainer: React.FC = () => {
    const reduxState = useSelector((state: StateInterface) => state);
    const modelRepositorySettings = getRepositoryLocationSettingsSelector(reduxState) || [];
    const onSaveModelRepistorySettings = () => {
        throw new Error('not implemented');
    };

    return (
        <ModelRepositoriesView
            repositoryLocationSettings={modelRepositorySettings}
            onSaveRepositoryLocationSettings={onSaveModelRepistorySettings}
        />
    );
};
