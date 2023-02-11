/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { CommandBar, ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { StringMap } from '../../api/models/stringMap';
import { ROUTE_PARAMS } from '../../constants/routes';
import { SAVE, ADD, UNDO, HELP, NAVIGATE_BACK, REPO, FOLDER } from '../../constants/iconNames';
import { ModelRepositoryStateInterface } from '../../shared/modelRepository/state';
import { ModelRepositoryFormType } from '../hooks/useModelRepositoryForm';
import { useModelRepositoryContext } from '../../shared/modelRepository/context/modelRepositoryStateContext';

export const Commands: React.FC<{formState: ModelRepositoryFormType}> = ({formState}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { search } = useLocation();
    const [{repositoryLocationSettings, dirty}, {setRepositoryLocationSettings, setRepositoryLocationSettingsErrors, setDirtyFlag}] = formState;

    const params = new URLSearchParams(search);
    const navigationBackAvailable = params.has(ROUTE_PARAMS.NAV_FROM);

    const [ modelRepositoryState, { setRepositoryLocations } ] = useModelRepositoryContext();

    const getCommandBarItems = (): ICommandBarItemProps[] => {
        const addItems = getCommandBarItemsAdd();

        const items = [
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
                disabled: repositoryLocationSettings.length === addItems.length,
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
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.help.ariaLabel),
                iconProps: { iconName: HELP},
                key: 'help',
                onClick: onHelpClick,
                text: t(ResourceKeys.modelRepository.commands.help.label)
            }
        ];

        if (navigationBackAvailable) {
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
        return [
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addPublicSource.ariaLabel),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public),
                iconProps: {
                    iconName: REPO
                },
                key: REPOSITORY_LOCATION_TYPE.Public,
                onClick: onAddRepositoryLocation(REPOSITORY_LOCATION_TYPE.Public),
                text: t(ResourceKeys.modelRepository.commands.addPublicSource.label),
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addConfigurableRepoSource.label),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable),
                iconProps: {
                    iconName: REPO
                },
                key: REPOSITORY_LOCATION_TYPE.Configurable,
                onClick: onAddRepositoryLocation(REPOSITORY_LOCATION_TYPE.Configurable),
                text: t(ResourceKeys.modelRepository.commands.addConfigurableRepoSource.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addLocalSource.ariaLabel),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local),
                iconProps: {
                    iconName: FOLDER
                },
                key: REPOSITORY_LOCATION_TYPE.Local,
                onClick: onAddRepositoryLocation(REPOSITORY_LOCATION_TYPE.Local),
                text: t(ResourceKeys.modelRepository.commands.addLocalSource.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addLocalDMRSource.ariaLabel),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.LocalDMR),
                iconProps: {
                    iconName: FOLDER
                },
                key: REPOSITORY_LOCATION_TYPE.LocalDMR,
                onClick: onAddRepositoryLocation(REPOSITORY_LOCATION_TYPE.LocalDMR),
                text: t(ResourceKeys.modelRepository.commands.addLocalDMRSource.label)
            }
        ];
    };

    const onHelpClick = () => {
        window.open(t(ResourceKeys.settings.questions.questions.documentation.link), '_blank');
    };

    const onSaveModelRepositorySettingsClick = () => {
        const errors = validateRepositoryLocationSettings(repositoryLocationSettings);

        if (Object.keys(errors).length === 0) {
            setRepositoryLocations(repositoryLocationSettings);
            setDirtyFlag(false);
        }

        setRepositoryLocationSettingsErrors(errors);
    };

    const onNavigateBackClick = () => history.goBack();

    const onRevertModelRepositorySettingsClick = () => {
        setDirtyFlag(false);
        setRepositoryLocationSettings(modelRepositoryState);
    };

    const onAddRepositoryLocation = (repositoryLocationType: REPOSITORY_LOCATION_TYPE) => () => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...repositoryLocationSettings,
            {
               repositoryLocationType,
               value: ''
            }
        ]);
    };

    return (
        <CommandBar
            items={getCommandBarItems()}
        />
    );
};

export const validateRepositoryLocationSettings = (repositoryLocationSettings: ModelRepositoryStateInterface): StringMap<string> => {
    const errors: StringMap<string> = {};
    repositoryLocationSettings.forEach(s => {
        if (!s.value) {
            if (s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local || s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.LocalDMR || s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable) {
                errors[s.repositoryLocationType] = ResourceKeys.modelRepository.types.mandatory;
            }
        }
    });

    return errors;
};
