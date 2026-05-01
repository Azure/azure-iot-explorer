/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    createLightTheme,
    createDarkTheme,
    teamsHighContrastTheme,
    Theme,
    BrandVariants,
} from '@fluentui/react-components';

// Brand color ramp for the light theme, centered on #0074CC (shade 80 = colorBrandBackground)
const lightBrand: BrandVariants = {
    10: '#001d33',
    20: '#003050',
    30: '#00436e',
    40: '#004578',
    50: '#005a9e',
    60: '#006ab8',
    70: '#0074CC',
    80: '#0074CC',
    90: '#106ebe',
    100: '#2b88d8',
    110: '#71afe5',
    120: '#c7e0f4',
    130: '#deecf9',
    140: '#eff6fc',
    150: '#f5f9fd',
    160: '#fafcfe',
};

// Brand color ramp for the dark theme, centered on #4ba6d8 (shade 70 = colorBrandBackground)
const darkBrand: BrandVariants = {
    10: '#030709',
    20: '#0c1b23',
    30: '#173241',
    40: '#1e3d54',
    50: '#2e6482',
    60: '#3d7da0',
    70: '#4ba6d8',
    80: '#5cafdd',
    90: '#72bbe2',
    100: '#95ccea',
    110: '#a8d5ef',
    120: '#bbdef3',
    130: '#cde8f7',
    140: '#e0f1fb',
    150: '#edf6fc',
    160: '#f0f8fd',
};

export const v9ThemeLight: Theme = createLightTheme(lightBrand);
export const v9ThemeDark: Theme = createDarkTheme(darkBrand);

// High contrast dark (white on black) — use Teams HC theme as-is
export const v9ThemeHighContrastDark: Theme = teamsHighContrastTheme;

// High contrast light (black on white) — invert the Teams HC theme
export const v9ThemeHighContrastLight: Theme = {
    ...teamsHighContrastTheme,
    colorNeutralForeground1: '#000000',
    colorNeutralForeground2: '#000000',
    colorNeutralForeground3: '#000000',
    colorNeutralBackground1: '#ffffff',
    colorNeutralBackground2: '#f5f5f5',
    colorNeutralBackground3: '#ebebeb',
    colorBrandBackground: '#000000',
    colorBrandForeground1: '#000000',
    colorBrandForeground2: '#000000',
    colorBrandStroke1: '#000000',
};
