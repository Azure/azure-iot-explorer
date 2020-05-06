/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, Prompt } from 'react-router-dom';
import { CommandBar, ICommandBarItemProps  } from 'office-ui-fabric-react/lib/CommandBar';
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
import { StringMap } from '../../api/models/stringMap';
import { ROUTE_PARAMS } from '../../constants/routes';
import { SAVE, ADD, UNDO, HELP, NAVIGATE_BACK } from '../../constants/iconNames';
import { ModelRepositoryInstruction } from './modelRepositoryInstruction';
import '../../css/_layouts.scss';

export interface ModelRepositoryLocationViewDataProps {
    repositoryLocationSettings: RepositoryLocationSettings[];
}

export interface ModelRepositoryLocationViewActionProps {
    onSaveRepositoryLocationSettings(modelRepositorySettings: RepositoryLocationSettings[]): void;
    onNavigateBack(): void;
}

export type ModelRepositoryLocationViewProps = ModelRepositoryLocationViewDataProps & ModelRepositoryLocationViewActionProps;

export const ModelRepositoryLocationView: React.FC<ModelRepositoryLocationViewProps> = props => {
    const [ repositoryLocationSettings, setRepositoryLocationSettings ] = React.useState<RepositoryLocationSettings[]>(props.repositoryLocationSettings);
    const [ repositoryLocationSettingsErrors, setRepositoryLocationSettingsErrors ] = React.useState<StringMap<string>>({});
    const [ dirty, setDirtyFlag ] = React.useState<boolean>(false);
    const { t } = useLocalizationContext();

    const getCommandBarItems = (): ICommandBarItemProps[] => {
        const addItems = getCommandBarItemsAdd();

        return [
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.save.ariaLabel),
                disabled: !dirty,
                iconProps: { iconName: SAVE },
                key: 'save',
                onClick: onSaveModelRepositorySettingsClick,
                text: t(ResourceKeys.modelRepository.commands.save.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.add.ariaLabel),
                iconProps: { iconName: ADD },
                key: 'add',
                subMenuProps: {
                    items: addItems
                },
                text: t(ResourceKeys.modelRepository.commands.add.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.revert.ariaLabel),
                disabled: !dirty,
                iconProps: { iconName: UNDO },
                key: 'revert',
                onClick: onRevertModelRepositorySettingsClick,
                text: t(ResourceKeys.modelRepository.commands.revert.label)
            }
        ];
    };

    const getCommandBarItemsFar = (): ICommandBarItemProps[] => {
        const items: ICommandBarItemProps[] = [
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.help.ariaLabel),
                iconProps: { iconName: HELP},
                key: 'help',
                onClick: onHelpClick,
                text: t(ResourceKeys.modelRepository.commands.help.label)
            }
        ];

        if (props.onNavigateBack) {
            items.push(
                {
                    ariaLabel: t(ResourceKeys.modelRepository.commands.back.ariaLabel),
                    iconProps: { iconName: NAVIGATE_BACK},
                    key: 'back',
                    onClick: onNavigateBackClick,
                    text: t(ResourceKeys.modelRepository.commands.back.label)
                }
            );
        }

        return items;
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

    const onHelpClick = () => {
        window.open(t(ResourceKeys.settings.questions.questions.documentation.link), '_blank');
    };

    const onSaveModelRepositorySettingsClick = () => {
        const errors = validateRepositoryLocationSettings(repositoryLocationSettings);

        if (Object.keys(errors).length === 0) {
            props.onSaveRepositoryLocationSettings(repositoryLocationSettings);
            setDirtyFlag(false);
        }

        setRepositoryLocationSettingsErrors(errors);
    };

    const onNavigateBackClick = () => {
        props.onNavigateBack();
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

    const onChangeRepositoryLocationSettings = (updatedRepositoryLocationSettings: RepositoryLocationSettings[]) => {
        setDirtyFlag(true);
        setRepositoryLocationSettingsErrors(validateRepositoryLocationSettings(updatedRepositoryLocationSettings));
        setRepositoryLocationSettings([
            ...updatedRepositoryLocationSettings
        ]);
    };

    return (
        <div className="view">
            <Prompt when={dirty} message={t(ResourceKeys.common.navigation.confirm)}/>
            <div className="view-command">
                <CommandBar
                    items={getCommandBarItems()}
                    farItems={getCommandBarItemsFar()}
                />
            </div>
            <div className="view-scroll-vertical">
                <ModelRepositoryInstruction empty={repositoryLocationSettings.length === 0}/>
                <ModelRepositoryLocationList
                    repositoryLocationSettings={repositoryLocationSettings}
                    repositoryLocationSettingsErrors={repositoryLocationSettingsErrors}
                    onChangeRepositoryLocationSettings={onChangeRepositoryLocationSettings}
                />
            </div>
        </div>
    );
};

export const validateRepositoryLocationSettings = (repositoryLocationSettings: RepositoryLocationSettings[]): StringMap<string> => {
    const errors: StringMap<string> = {};
    repositoryLocationSettings.forEach(s => {
        if (s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local && !s.value) {
            errors[REPOSITORY_LOCATION_TYPE.Local] = ResourceKeys.modelRepository.types.local.folderPicker.errors.mandatory;
        }
    });

    return errors;
};

export const ModelRepositoryLocationViewContainer: React.FC<RouteComponentProps> = props => {
    const reduxState = useSelector((state: StateInterface) => state);
    const dispatch = useDispatch();
    const modelRepositorySettings = getRepositoryLocationSettingsSelector(reduxState) || [];
    const onSaveModelRepositorySettings = (repositoryLocationSettings: RepositoryLocationSettings[]) => {
        dispatch(setRepositoryLocationsAction(repositoryLocationSettings));
    };

    const getNavigateBack = () => {
        if (!props.history || !props.location.search || !props.location.search) {
            return undefined;
        }

        const params = new URLSearchParams(props.location.search);
        if (params.has(ROUTE_PARAMS.NAV_FROM)) {
            return () => { props.history.goBack(); };
        }
    };

    return (
        <ModelRepositoryLocationView
            repositoryLocationSettings={modelRepositorySettings}
            onSaveRepositoryLocationSettings={onSaveModelRepositorySettings}
            onNavigateBack={getNavigateBack()}
        />
    );
};
