/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IPartialTheme } from '@fluentui/react';

export const THEME_DARK: IPartialTheme =  {
    palette: {
        black: '#f8f8f8', // primary text color
        neutralDark: '#fAfAfA', // action button text on hover
        neutralLight: '#252525',
        neutralLighter: '#605e5c', // disabled button
        neutralLighterAlt: '#0b0b0b',
        neutralPrimary: '#cccccc', // used in button text
        neutralPrimaryAlt: '#dadada',
        neutralQuaternary: '#373737',
        neutralQuaternaryAlt: '#2f2f2f',
        neutralSecondary: '#d0d0d0', // watermarks and non-linking breadcrumb
        neutralTertiary: '#c8c8c8',
        neutralTertiaryAlt: '#595959', // disabled buttons, unselected slider portion
        themeDark: '#72bbe2', // buttons being clicked
        themeDarkAlt: '#5cafdd', // default button on hover
        themeDarker: '#95ccea',
        themeLight: '#173241',
        themeLighter: '#0c1b23', // slider unselected on hover
        themeLighterAlt: '#030709',
        themePrimary: '#4ba6d8', // command bar button icons, slider selected portion
        themeSecondary: '#4393bf',
        themeTertiary: '#2e6482',
        white: '#000000', // button text and command bar background
    }
};

export const THEME_LIGHT: IPartialTheme =  {
    palette: {
        black: '#1d1d1d', // primary text color
        neutralDark: '#272727', // action button text on hover
        neutralLight: '#eaeaea',
        neutralLighter: '#fafafa', // disabled button
        neutralLighterAlt: '#f8f8f8',
        neutralPrimary: '#333333', // used in button text
        neutralPrimaryAlt: '#4b4b4b',
        neutralQuaternary: '#d0d0d0',
        neutralQuaternaryAlt: '#dadada',
        neutralSecondary: '#737373', // watermarks and non-linking breadcrumbs
        neutralTertiary: '#c2c2c2',
        neutralTertiaryAlt: '#c8c8c8', // disabled buttons, unselected slider portion
        themeDark: '#005a9e', // buttons being clicked
        themeDarkAlt: '#106ebe', // default button on hover
        themeDarker: '#004578',
        themeLight: '#c7e0f4',
        themeLighter: '#deecf9', // slider unselected on hover
        themeLighterAlt: '#eff6fc',
        themePrimary: '#0074CC', // command bar button icons, slider selected portion
        themeSecondary: '#2b88d8',
        themeTertiary: '#71afe5',
        white: '#ffffff', // button text and command bar background
      }
};

export const THEME_DARK_HC: IPartialTheme = {
    palette: {
        black: '#FFFFFF', // primary text color
        neutralDark: '#fAfAfA', // action button text on hover
        neutralLight: '#252525',
        neutralLighter: '#605e5c', // disabled button
        neutralLighterAlt: '#0b0b0b',
        neutralPrimary: '#ffffff', // used in button text
        neutralPrimaryAlt: '#dadada',
        neutralQuaternary: '#373737',
        neutralQuaternaryAlt: '#2f2f2f',
        neutralSecondary: '#ffffff', // watermarks and non-linking breadcrumb
        neutralTertiary: '#c8c8c8',
        neutralTertiaryAlt: '#3FF23F', // disabled buttons, unselected slider portion
        themeDark: '#1AEBFF', // buttons being clicked
        themeDarkAlt: '#1AEBFF', // default button on hover
        themeDarker: '#95ccea',
        themeLight: '#173241',
        themeLighter: '#3FF23F',  // slider unselected on hover
        themeLighterAlt: '#030709',
        themePrimary: '#1AEBFF', // command bar button icons, slider selected portion
        themeSecondary: '#4393bf',
        themeTertiary: '#2e6482',
        white: '#000000', // button text and command bar background
    }
};

export const THEME_LIGHT_HC: IPartialTheme = {
    palette: {
        black: '#000000', // primary text color
        neutralDark: '#272727', // action button text on hover
        neutralLight: '#eaeaea',
        neutralLighter: '#fafafa', // disabled button
        neutralLighterAlt: '#f8f8f8',
        neutralPrimary: '#000000', // used in button text
        neutralPrimaryAlt: '#4b4b4b',
        neutralQuaternary: '#d0d0d0',
        neutralQuaternaryAlt: '#dadada',
        neutralSecondary: '#000000', // watermarks and non-linking breadcrumbs
        neutralTertiary: '#c2c2c2',
        neutralTertiaryAlt: '#000000', // disabled buttons, unselected slider portion
        themeDark: '#000000', // buttons being clicked
        themeDarkAlt: '#000000', // default button on hover
        themeDarker: '#004578',
        themeLight: '#c7e0f4',
        themeLighter: '#000000', // slider unselected on hover
        themeLighterAlt: '#eff6fc',
        themePrimary: '#000000', // command bar button icons, slider selected portion
        themeSecondary: '#2b88d8',
        themeTertiary: '#71afe5',
        white: '#ffffff', // button text and command bar background
    }
};

export const SCOPED_SETTINGS = {

    Toggle: {
        styles: {
            root: {
                fontSize: '12px'
            }
        }
    },

    TextField: {
        styles: {
            root: {
                fontSize: '12px',
                selectors: {
                    input : {
                        fontSize: '12px'
                    }
                }
            }
        }
    }
};
