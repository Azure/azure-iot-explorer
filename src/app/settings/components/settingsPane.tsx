/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { DefaultButton, ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { Theme, useThemeContext } from '../../shared/contexts/themeContext';
import { THEME_SELECTION } from '../../constants/browserStorage';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../constants/routes';
import '../../css/_settingsPane.scss';

const SettingsPane: React.FC = () => {
    const [ showPanel, setShowPanel ] = React.useState<boolean>(false);
    const [ darkTheme, setDarkTheme] = React.useState<boolean>(false);
    const { t } = useLocalizationContext();
    const { updateTheme } = useThemeContext();

    React.useEffect(() => {
        const theme = localStorage.getItem(THEME_SELECTION);
        setDarkTheme(theme === Theme.dark || theme === Theme.highContrastBlack);
    },              []);

    const togglePanelVisibility = () => {
        setShowPanel(!showPanel);
    };

    const toggleTheme = () => {
        const newDarkTheme = !darkTheme;
        setDarkTheme(newDarkTheme);
        updateTheme(newDarkTheme);
    };

    const renderFooter = () => {
        return (
            <footer className="settings-footer">
                <section className="footer-buttons">
                    <DefaultButton
                        type="reset"
                        text={t(ResourceKeys.common.close)}
                        onClick={togglePanelVisibility}
                    />
                </section>
            </footer>
        );
    };

    return (
        <>
            <ActionButton
                iconProps={{iconName: 'Settings'}}
                onClick={togglePanelVisibility}
                text={t(ResourceKeys.header.settings.launch)}
                ariaLabel={t(ResourceKeys.header.settings.launch)}
            />

            <Panel
                className="settingsPane"
                role="dialog"
                isOpen={showPanel}
                onDismiss={togglePanelVisibility}
                type={PanelType.medium}
                isFooterAtBottom={true}
                onRenderFooter={renderFooter}
                closeButtonAriaLabel={t(ResourceKeys.common.close)}
            >
                <header className="panel-header">
                    <h2>{t(ResourceKeys.settings.headerText)}</h2>
                </header>
                <section aria-label={t(ResourceKeys.settings.configuration.headerText)}>
                    <h3 role="heading" aria-level={1}>{t(ResourceKeys.settings.configuration.headerText)}</h3>
                    <span>{t(ResourceKeys.settings.configuration.redirect)}</span>
                    <Link
                        className="home-link"
                        onClick={togglePanelVisibility}
                        href={`#/${ROUTE_PARTS.HOME}`}
                    >
                        {t(ResourceKeys.settings.configuration.redirectLink)}
                    </Link>
                </section>
                <section aria-label={t(ResourceKeys.settings.modelDefinitions.headerText)}>
                    <h3 role="heading" aria-level={1}>{t(ResourceKeys.settings.modelDefinitions.headerText)}</h3>
                    <span>{t(ResourceKeys.settings.modelDefinitions.redirect)}</span>
                    <Link
                        onClick={togglePanelVisibility}
                        className="home-link"
                        href={`#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}?${ROUTE_PARAMS.NAV_FROM}`}
                    >
                        {t(ResourceKeys.settings.modelDefinitions.redirectLink)}
                    </Link>
                </section>
                <section aria-label={t(ResourceKeys.settings.theme.headerText)}>
                    <h3 role="heading" aria-level={1}>{t(ResourceKeys.settings.theme.headerText)}</h3>
                    <Toggle
                        onText={t(ResourceKeys.settings.theme.darkTheme)}
                        offText={t(ResourceKeys.settings.theme.lightTheme)}
                        onChange={toggleTheme}
                        checked={darkTheme}
                    />
                </section>
            </Panel>
        </>
    );
};

export default SettingsPane;
