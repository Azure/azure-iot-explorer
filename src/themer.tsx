/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { createTheme } from 'office-ui-fabric-react/lib/Styling';
import { SCOPED_SETTINGS } from './app/constants/themes';
import { getDarkModeSetting, getHighContrastSetting, setDarkModeSetting } from './app/api/services/settingsService';
import { Theme, ThemeContextProvider, ThemeProperties } from './app/shared/contexts/themeContext';

export const getTheme = (isDarkMode: boolean, isHighContrast: boolean): Theme => {
    if (isHighContrast) {
        return isDarkMode ? Theme.highContrastBlack : Theme.highContrastWhite;
    } else {
        return isDarkMode ? Theme.dark : Theme.light;
    }
};

export const Themer: React.FC = ({ children }) => {
    const [ themeProperties, setThemeProperties ] = React.useState<ThemeProperties>(ThemeProperties[Theme.light]);
    const currentTheme = createTheme(themeProperties.fabricTheme);

    const initialize = async () => {
        const darkMode: boolean = getDarkModeSetting();
        const highContrast: boolean = await getHighContrastSetting();
        const theme = getTheme(darkMode, highContrast);
        setThemeProperties(ThemeProperties[theme]);
    };

    const updateThemeHandler = async (isDarkMode: boolean) => {
        const newTheme = getTheme(isDarkMode, (themeProperties.theme === Theme.highContrastBlack || themeProperties.theme === Theme.highContrastWhite));
        setThemeProperties(ThemeProperties[newTheme]);
        setDarkModeSetting(isDarkMode);
    };

    React.useEffect(() => {
        initialize();
    }, []); // tslint:disable-line: align

    React.useLayoutEffect(() => {
        const bodyTheme = themeProperties.theme;
        for (const removedTheme in Theme) {
            if (bodyTheme !== removedTheme) {
                document.body.classList.remove(`theme-${removedTheme}`);
            }
        }
        if (!document.body.classList.contains(`theme-${bodyTheme}`)) {
            document.body.classList.add(`theme-${bodyTheme}`);
        }
    }, [themeProperties]);  // tslint:disable-line: align

    return (
        <Customizer settings={{ theme: { ...currentTheme } }} scopedSettings={{ ...SCOPED_SETTINGS }}>
            <Fabric>
                <ThemeContextProvider value={{ ...themeProperties, updateTheme: updateThemeHandler }}>
                    {children}
                </ThemeContextProvider>
            </Fabric>
        </Customizer>
    );
};
