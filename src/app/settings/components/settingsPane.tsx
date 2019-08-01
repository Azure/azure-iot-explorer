/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { validateConnectionString } from '../../shared/utils/hubConnectionStringHelper';
import RepositoryLocationList from './repositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { CopyableMaskField } from '../../shared/components/copyableMaskField';
import LabelWithTooltip from '../../shared/components/labelWithTooltip';
import '../../css/_settingsPane.scss';

export interface SettingsPaneProps extends Settings {
    isOpen: boolean;
}

export interface SettingsPaneActions {
    onSettingsVisibleChanged: (visible: boolean) => void;
    onSettingsSave: (payload: Settings) => void;
    refreshDevices: () => void;
}

export interface RepositorySettings {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    connectionString?: string;
}

export interface Settings {
    hubConnectionString: string;
    rememberConnectionString: boolean;
    repositoryLocations?: RepositorySettings[];
}

interface SettingsPaneState extends Settings{
    error?: string;
    isDirty: boolean;
}

export default class SettingsPane extends React.Component<SettingsPaneProps & SettingsPaneActions & RouteComponentProps, SettingsPaneState> {
    constructor(props: SettingsPaneProps & SettingsPaneActions & RouteComponentProps) {
        super(props);
        const repositoryLocations = props.repositoryLocations ? props.repositoryLocations.map(value => {
            return {
                connectionString: value.connectionString,
                repositoryLocationType: value.repositoryLocationType};
            }) : [];
        this.state = {
            hubConnectionString: props.hubConnectionString,
            isDirty: false,
            rememberConnectionString: props.rememberConnectionString,
            repositoryLocations,
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                <Panel
                    className="settingsPane"
                    role="dialog"
                    isOpen={this.props.isOpen}
                    onDismiss={this.closePane}
                    type={PanelType.medium}
                    isFooterAtBottom={true}
                    onRenderFooter={this.settingsFooter}
                >
                    <header className="panel-header">
                        <h2>{context.t(ResourceKeys.settings.headerText)}</h2>
                    </header>
                    <section aria-label={context.t(ResourceKeys.settings.configuration.headerText)}>
                        <h3 role="heading">{context.t(ResourceKeys.settings.configuration.headerText)}</h3>
                        <CopyableMaskField
                            t={context.t}
                            error={this.state.error && context.t(this.state.error)}
                            ariaLabel={context.t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                            label={context.t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                            calloutContent={(<div className="callout-wrapper">
                            <div className="content">
                                {context.t(ResourceKeys.settings.configuration.connectionString.sublabel)}
                            </div>
                            <div className="footer">
                                <Link
                                    href={context.t(ResourceKeys.settings.configuration.connectionString.link)}
                                    target="_blank"
                                >
                                    {context.t(ResourceKeys.settings.configuration.connectionString.link)}
                                </Link>
                            </div>
                        </div>)}
                            value={this.state.hubConnectionString}
                            allowMask={true}
                            readOnly={false}
                            onTextChange={this.onConnectionStringChanged}
                        />
                    </section>
                    <div className="remember-connection-string">
                        <Checkbox
                            ariaLabel={context.t(ResourceKeys.connectivityPane.connectionStringCheckbox.ariaLabel)}
                            onChange={this.onCheckboxChange}
                            checked={this.state.rememberConnectionString}
                        />
                        <LabelWithTooltip
                            tooltipText={context.t(ResourceKeys.connectivityPane.connectionStringCheckbox.tooltip)}
                        >
                            {context.t(ResourceKeys.connectivityPane.connectionStringCheckbox.label)}
                        </LabelWithTooltip>
                    </div>
                    <section aria-label={context.t(ResourceKeys.settings.modelDefinitions.headerText)}>
                        <h3 role="heading">{context.t(ResourceKeys.settings.modelDefinitions.headerText)}</h3>
                        <span className="helptext">{context.t(ResourceKeys.settings.modelDefinitions.helpText)}</span>
                        <RepositoryLocationList
                            items={this.state.repositoryLocations}
                            onAddListItem={this.onAddListItem}
                            onMoveItem={this.onMoveRepositoryLocation}
                            onPrivateRepositoryConnectionStringChanged={this.onPrivateRepositoryConnectionStringChanged}
                            onRemoveListItem={this.onRemoveListItem}
                        />
                    </section>
                </Panel>
            )}
            </LocalizationContextConsumer>
        );
    }

    private readonly onAddListItem = (type: REPOSITORY_LOCATION_TYPE) => {
        const items = this.state.repositoryLocations;
        items.push({
            repositoryLocationType: type
        });
        this.setState({
            isDirty: true,
            repositoryLocations: [...items]
        });
    }

    private readonly onRemoveListItem = (index: number) => {
        const items = this.state.repositoryLocations;
        items.splice(index, 1);
        this.setState({
            isDirty: true,
            repositoryLocations: [...items]
        });
    }

    private readonly onPrivateRepositoryConnectionStringChanged = (connectionString: string) => {
        const items = this.state.repositoryLocations;
        const item = items[items.findIndex(value => value.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private)];
        item.connectionString = connectionString;
        this.setState({
            isDirty: true,
            repositoryLocations: [...items]
        });
    }

    private readonly onMoveRepositoryLocation = (oldIndex: number, newIndex: number) => {
        const items = this.state.repositoryLocations;
        items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
        this.setState({
            isDirty: true,
            repositoryLocations: [...items]
        });
    }

    private readonly onConnectionStringChanged = (hubConnectionString: string)  => {
        this.setState({
            error: validateConnectionString(hubConnectionString),
            hubConnectionString,
            isDirty: true
        });
    }

    private readonly closePane = () => {
        if (this.state.isDirty) {
            this.setState({
                error: '',
                hubConnectionString: this.props.hubConnectionString,
                isDirty: false,
                repositoryLocations: [...(this.props.repositoryLocations && this.props.repositoryLocations.map(value => {
                    return {
                        connectionString: value.connectionString,
                        repositoryLocationType: value.repositoryLocationType
                    };
                }))]
            });
        }
        this.props.onSettingsVisibleChanged(false);
    }

    private readonly saveSettings = () => {
        this.props.onSettingsSave({...this.state});
        this.setState({
            isDirty: false
        });
        this.props.onSettingsVisibleChanged(false);

        if (this.props.location.pathname === '/devices') {
            this.props.refreshDevices();
        }
        else {
            this.props.history.push('/devices');
        }
    }

    private readonly settingsFooter = () => {
        return (
        <LocalizationContextConsumer>
            {(context: LocalizationContextInterface) => (
                <footer className="settings-footer">
                    <section aria-label={context.t(ResourceKeys.settings.questions.headerText)}>
                        <h3 role="heading">{context.t(ResourceKeys.settings.questions.headerText)}</h3>
                        <ul className="faq">
                            <li className="faq-item">
                                <Link
                                    href={context.t(ResourceKeys.settings.questions.questions.documentation.link)}
                                    target="_blank"
                                >{context.t(ResourceKeys.settings.questions.questions.documentation.text)}
                                </Link>
                            </li>
                        </ul>
                    </section>
                    <section className="footer-buttons">
                        <h3 role="heading">{context.t(ResourceKeys.settings.footerText)}</h3>
                        <PrimaryButton
                            type="submit"
                            disabled={this.disableSaveButton()}
                            text={context.t(ResourceKeys.settings.save)}
                            onClick={this.saveSettings}
                        />
                        <DefaultButton
                            type="reset"
                            text={context.t(ResourceKeys.settings.cancel)}
                            onClick={this.closePane}
                        />
                    </section>
                </footer>
            )}
            </LocalizationContextConsumer>
        );
    }

    private readonly onCheckboxChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
        this.setState({
            isDirty: true,
            rememberConnectionString: isChecked,
        });
    }

    private readonly disableSaveButton = () => {
        const shouldBeDisabled = !this.state.isDirty || !!this.state.error;
        if (shouldBeDisabled) {
            return shouldBeDisabled;
        }
        else {
            // when state is dirty and has no errors, check if private repo has been added along with it's connection string
            const privateLocationSetting = this.state.repositoryLocations.filter(location => location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private);
            if (privateLocationSetting && privateLocationSetting.length !== 0  ) {
                return !privateLocationSetting[0].connectionString;
            }
        }
    }
}
