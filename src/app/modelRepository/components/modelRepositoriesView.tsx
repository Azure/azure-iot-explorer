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
    modelRespositorySettings: RepositoryLocationSettings[];
}

export interface ModelRepositoriesViewActionProps {
    onSaveModelRepositorySettings(modelRepositorySettings: RepositoryLocationSettings[]): void;
}

export type ModelRepositoriesViewProps = ModelRepositoriesViewDataProps & ModelRepositoriesViewActionProps;

export const ModelRepositoriesView: React.FC<ModelRepositoriesViewProps> = props => {
    const [ modelRepositoryLocationSettings, setModelRepositorySettings ] = React.useState<RepositoryLocationSettings[]>(props.modelRespositorySettings);
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
                disabled: modelRepositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public),
                key: REPOSITORY_LOCATION_TYPE.Public,
                onClick: onAddRepositoryLocationPublic,
                text: t(ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label)
            },
            {
                disabled: modelRepositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Device),
                key: REPOSITORY_LOCATION_TYPE.Device,
                onClick: onAddRepositoryLocationDevice,
                text: t(ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label),
            },
            {
                disabled: hostModeNotElectron || modelRepositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local),
                key: REPOSITORY_LOCATION_TYPE.Local,
                onClick: onAddRepositoryLocationLocal,
                text: t(hostModeNotElectron ?
                    ResourceKeys.settings.modelDefinitions.repositoryTypes.local.labelInBrowser :
                    ResourceKeys.settings.modelDefinitions.repositoryTypes.local.label)
            }
        ];
    };

    const onAddRepositoryLocationPublic = () => {
        throw new Error('not implemented');
    };

    const onAddRepositoryLocationLocal = () => {
        throw new Error('not implemented');
    };

    const onAddRepositoryLocationDevice = () => {
        throw new Error('not implemented');

    };

    const onChangeRepositories = (repositoryLocationSettings: RepositoryLocationSettings[]) => {
        throw new Error('not implemented');
    };

    return (
        <div className="view">
            <div className="view-command">
                <CommandBar items={getCommandBarItems()} />
            </div>
            <div className="view-content view-scroll-vertical">
                <ModelRepositoryLocationList
                     items={props.modelRespositorySettings}
                     onAddListItem={undefined}
                     onMoveItem={undefined}
                     onLocalFolderPathChanged={undefined}
                     onRemoveListItem={undefined}
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

    // tslint:disable-next-line: no-console
    console.log(JSON.stringify(reduxState));

    return (
        <ModelRepositoriesView
            modelRespositorySettings={modelRepositorySettings}
            onSaveModelRepositorySettings={onSaveModelRepistorySettings}
        />
    );
};
