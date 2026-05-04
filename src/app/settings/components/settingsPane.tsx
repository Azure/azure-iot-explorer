/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, Link, OverlayDrawer, Switch } from '@fluentui/react-components';
import { DismissRegular, SettingsRegular } from '@fluentui/react-icons';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { Theme, useThemeContext } from '../../shared/contexts/themeContext';
import { THEME_SELECTION } from '../../constants/browserStorage';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../constants/routes';
import './settingsPane.scss';

export const SettingsPane: React.FC = () => {
    const [ showPanel, setShowPanel ] = React.useState<boolean>(false);
    const [ darkTheme, setDarkTheme] = React.useState<boolean>(false);
    const { t } = useTranslation();
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

    return (
        <>
            <Button
                appearance="transparent"
                icon={<SettingsRegular />}
                onClick={togglePanelVisibility}
                aria-label={t(ResourceKeys.header.settings.launch)}
            >
                {t(ResourceKeys.header.settings.launch)}
            </Button>

            <OverlayDrawer
                className="headerPane"
                open={showPanel}
                onOpenChange={(e, data) => { if (!data.open) setShowPanel(false); }}
                position="end"
                size="small"
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                icon={<DismissRegular />}
                                onClick={togglePanelVisibility}
                                aria-label={t(ResourceKeys.common.close)}
                            />
                        }
                    >
                        {t(ResourceKeys.settings.headerText)}
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody>
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
                        <Switch
                            onChange={toggleTheme}
                            checked={darkTheme}
                            label={darkTheme ?
                                t(ResourceKeys.settings.theme.darkTheme) :
                                t(ResourceKeys.settings.theme.lightTheme)}
                        />
                    </section>
                </DrawerBody>
                <DrawerFooter>
                    <Button
                        onClick={togglePanelVisibility}
                    >
                        {t(ResourceKeys.common.close)}
                    </Button>
                </DrawerFooter>
            </OverlayDrawer>
        </>
    );
};
