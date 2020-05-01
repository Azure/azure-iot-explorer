/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ConfirmationDialog } from './confirmationDialog';
import { ThemeContextConsumer, ThemeContextInterface, Theme } from '../../shared/contexts/themeContext';
import { THEME_SELECTION } from '../../constants/browserStorage';
import { Notification } from '../../api/models/notification';
import { ROUTE_PARTS } from '../../constants/routes';
import '../../css/_settingsPane.scss';

export interface SettingsPaneDataProps {
    isOpen: boolean;
}

export interface SettingsPaneActionProps {
    toggleVisibility(visible: boolean): void;
}

interface SettingsPaneState {
    isDarkTheme: boolean;
    isDirty: boolean;
    showConfirmationDialog: boolean;
}

export type SettingsPaneProps = SettingsPaneDataProps & SettingsPaneActionProps;

export default class SettingsPane extends React.Component<SettingsPaneProps, SettingsPaneState> {
    constructor(props: SettingsPaneProps) {
        super(props);
        const theme = localStorage.getItem(THEME_SELECTION);

        this.state = {
            isDarkTheme: Theme.dark === theme || Theme.highContrastBlack === theme,
            isDirty: false,
            showConfirmationDialog: false,
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
                        onDismiss={this.dismissPane}
                        type={PanelType.medium}
                        isFooterAtBottom={true}
                        onRenderFooter={this.settingsFooter}
                        closeButtonAriaLabel={context.t(ResourceKeys.common.close)}
                    >
                        <header className="panel-header">
                            <h2>{context.t(ResourceKeys.settings.headerText)}</h2>
                        </header>
                        <section aria-label={context.t(ResourceKeys.settings.configuration.headerText)}>
                            <h3 role="heading" aria-level={1}>{context.t(ResourceKeys.settings.configuration.headerText)}</h3>
                            <NavLink to={`/${ROUTE_PARTS.HOME}`}>{context.t(ResourceKeys.settings.configuration.redirect)}</NavLink>
                        </section>
                        <section aria-label={context.t(ResourceKeys.settings.modelDefinitions.headerText)}>
                            <h3 role="heading" aria-level={1}>{context.t(ResourceKeys.settings.modelDefinitions.headerText)}</h3>
                            <NavLink to={`"/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`}>{context.t(ResourceKeys.settings.modelDefinitions.redirect)}</NavLink>
                        </section>
                        <section aria-label={context.t(ResourceKeys.settings.theme.headerText)}>
                            <h3 role="heading" aria-level={1}>{context.t(ResourceKeys.settings.theme.headerText)}</h3>
                            <Toggle
                                onText={context.t(ResourceKeys.settings.theme.darkTheme)}
                                offText={context.t(ResourceKeys.settings.theme.lightTheme)}
                                onChange={this.setTheme}
                                checked={this.state.isDarkTheme}
                            />
                        </section>
                        {this.renderConfirmationDialog(context)}
                    </Panel>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly setTheme = (ev: React.MouseEvent<HTMLElement>, isDarkTheme: boolean) => {
        this.setState({
            isDarkTheme,
            isDirty: true,
        });
    }

    private readonly renderConfirmationDialog = (context: LocalizationContextInterface) => {
        if (this.state.isDirty && this.state.showConfirmationDialog) {
            return (
                <ConfirmationDialog
                    t={context.t}
                    messageKey={ResourceKeys.settings.confirmationMessage}
                    onYes={this.onDialogConfirmCancel}
                    onNo={this.closeDialog}
                />
            );
        }
    }

    private readonly dismissPane = (event?: React.SyntheticEvent<HTMLElement, Event>) => {
        event.preventDefault();
        if (this.state.isDirty) {
            this.revertState();
        }
        this.props.toggleVisibility(false);
    }

    private readonly closePane = () => {
        if (this.state.isDirty) {
            this.showDialog();
        }
        else {
            this.props.toggleVisibility(false);
        }
    }

    private readonly onDialogConfirmCancel = (): void => {
        this.revertState();
        this.props.toggleVisibility(false);
    }

    private readonly revertState = (): void => {
        this.setState({
            isDirty: false,
            showConfirmationDialog: false
        });
    }

    private readonly showDialog = (): void => {
        this.setState({ showConfirmationDialog: true });
    }

    private readonly closeDialog = (): void => {
        this.setState({ showConfirmationDialog: false });
    }

    private readonly saveSettings = () => {
        this.props.toggleVisibility(false);
    }

    private readonly settingsFooter = () => {
        return (
        <LocalizationContextConsumer>
            {(context: LocalizationContextInterface) => (
                <footer className="settings-footer">
                    <section aria-label={context.t(ResourceKeys.settings.questions.headerText)}>
                        <h3 role="heading" aria-level={1}>{context.t(ResourceKeys.settings.questions.headerText)}</h3>
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
                        <h3 role="heading" aria-level={1}>{context.t(ResourceKeys.settings.footerText)}</h3>
                        <ThemeContextConsumer>
                            {(themeContext: ThemeContextInterface) => (
                                <PrimaryButton
                                    type="submit"
                                    disabled={this.disableSaveButton()}
                                    text={context.t(ResourceKeys.settings.save)}
                                    // tslint:disable-next-line: jsx-no-lambda
                                    onClick={() => {
                                            themeContext.updateTheme(this.state.isDarkTheme);
                                            this.saveSettings();
                                        }
                                    }
                                />
                            )}
                        </ThemeContextConsumer>
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

    private readonly disableSaveButton = () => {
        // 1. check dirty and hub connection string
        const shouldBeDisabled = !this.state.isDirty;
        return shouldBeDisabled;
    }
}
