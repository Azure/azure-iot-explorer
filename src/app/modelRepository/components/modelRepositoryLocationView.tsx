/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt, useHistory, useLocation } from 'react-router-dom';
import { CommandBar, ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ModelRepositoryLocationList } from './modelRepositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { StringMap } from '../../api/models/stringMap';
import { ROUTE_PARAMS } from '../../constants/routes';
import { SAVE, ADD, UNDO, HELP, NAVIGATE_BACK, REPO, FOLDER } from '../../constants/iconNames';
import { ModelRepositoryInstruction } from './modelRepositoryInstruction';
import { ModelRepositoryStateInterface } from '../../shared/modelRepository/state';
import { useModelRepositoryContext } from '../../shared/modelRepository/context/modelRepositoryStateContext';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { AppInsightsClient } from '../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../constants/telemetry';
import '../../css/_layouts.scss';

export const ModelRepositoryLocationView: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { search } = useLocation();
    useBreadcrumbEntry({ name: t(ResourceKeys.breadcrumb.ioTPlugAndPlay)});

    const params = new URLSearchParams(search);
    const navigationBackAvailable = params.has(ROUTE_PARAMS.NAV_FROM);

    const [ modelRepositoryState, { setRepositoryLocations } ] = useModelRepositoryContext();
    const [ repositoryLocationSettings, setRepositoryLocationSettings ] = React.useState<ModelRepositoryStateInterface>(modelRepositoryState);
    const [ repositoryLocationSettingsErrors, setRepositoryLocationSettingsErrors ] = React.useState<StringMap<string>>({});
    const [ dirty, setDirtyFlag ] = React.useState<boolean>(false);

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
        const hostModeBrowser: boolean = appConfig.hostMode === HostMode.Browser;

        return [
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addPublicSource.ariaLabel),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public),
                iconProps: {
                    iconName: REPO
                },
                key: REPOSITORY_LOCATION_TYPE.Public,
                onClick: onAddRepositoryLocationPublic,
                text: t(ResourceKeys.modelRepository.commands.addPublicSource.label),
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addConfigurableRepoSource.label),
                disabled: repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable),
                iconProps: {
                    iconName: REPO
                },
                key: REPOSITORY_LOCATION_TYPE.Configurable,
                onClick: onAddRepositoryLocationConfigurable,
                text: t(ResourceKeys.modelRepository.commands.addConfigurableRepoSource.label)
            },
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.addLocalSource.ariaLabel),
                disabled: hostModeBrowser || repositoryLocationSettings.some(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local),
                iconProps: {
                    iconName: FOLDER
                },
                key: REPOSITORY_LOCATION_TYPE.Local,
                onClick: onAddRepositoryLocationLocal,
                text: t(hostModeBrowser ?
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

    const onAddRepositoryLocationPublic = () => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...repositoryLocationSettings,
            {
               repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
               value: ''
            }
        ]);
    };

    const onAddRepositoryLocationConfigurable = () => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...repositoryLocationSettings,
            {
               repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable,
               value: ''
            }
        ]);
    };

    const onAddRepositoryLocationLocal = () => {
        setDirtyFlag(true);
        setRepositoryLocationSettings([
            ...repositoryLocationSettings,
            {
               repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
               value: ''
            }
        ]);
    };

    const onChangeRepositoryLocationSettings = (updatedRepositoryLocationSettings: ModelRepositoryStateInterface) => {
        setDirtyFlag(true);
        setRepositoryLocationSettingsErrors(validateRepositoryLocationSettings(updatedRepositoryLocationSettings));
        setRepositoryLocationSettings([
            ...updatedRepositoryLocationSettings
        ]);
    };

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.PNP_REPO_SETTINGS});
    }, []); // tslint:disable-line: align

    return (
        <div>
            <Prompt when={dirty} message={t(ResourceKeys.common.navigation.confirm)}/>
            <CommandBar
                items={getCommandBarItems()}
            />
            <div>
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

export const validateRepositoryLocationSettings = (repositoryLocationSettings: ModelRepositoryStateInterface): StringMap<string> => {
    const errors: StringMap<string> = {};
    repositoryLocationSettings.forEach(s => {
        if (s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local && !s.value) {
            errors[REPOSITORY_LOCATION_TYPE.Local] = ResourceKeys.modelRepository.types.local.folderPicker.errors.mandatory;
        }
        if (s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable && !s.value) {
            errors[REPOSITORY_LOCATION_TYPE.Configurable] = ResourceKeys.modelRepository.types.configurable.errors.mandatory;
        }
    });

    return errors;
};
