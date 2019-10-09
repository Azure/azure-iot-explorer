/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IPartialTheme } from 'office-ui-fabric-react/lib/Styling';

export const THEME_DARK: IPartialTheme =  {
    palette: {
        black: '#f8f8f8',
        neutralDark: '#fAfAfA', // action button text on hover
        neutralLight: '#252525',
        neutralLighter: '#605e5c', // disabled button
        neutralLighterAlt: '#0b0b0b',
        neutralPrimary: '#ffffff', // used in button text
        neutralPrimaryAlt: '#dadada',
        neutralQuaternary: '#373737',
        neutralQuaternaryAlt: '#2f2f2f',
        neutralSecondary: '#d0d0d0', // watermarks and non-linking breadcrumb
        neutralTertiary: '#c8c8c8',
        neutralTertiaryAlt: '#595959', // disabled buttons
        themeDark: '#72bbe2', // buttons being clicked
        themeDarkAlt: '#5cafdd',
        themeDarker: '#95ccea',
        themeLight: '#173241',
        themeLighter: '#0c1b23',
        themeLighterAlt: '#030709',
        themePrimary: '#4ba6d8',
        themeSecondary: '#4393bf',
        themeTertiary: '#2e6482',
        white: '#000000', // button text and command bar background
    }
};

export const THEME_LIGHT: IPartialTheme =  {
    palette: {
        black: '#1d1d1d',
        neutralDark: '#272727',
        neutralLight: '#eaeaea',
        neutralLighter: '#fafafa',
        neutralLighterAlt: '#f8f8f8',
        neutralPrimary: '#333',
        neutralPrimaryAlt: '#4b4b4b',
        neutralQuaternary: '#d0d0d0',
        neutralQuaternaryAlt: '#dadada',
        neutralSecondary: '#737373',
        neutralTertiary: '#c2c2c2',
        neutralTertiaryAlt: '#c8c8c8',
        themeDark: '#005a9e',
        themeDarkAlt: '#106ebe',
        themeDarker: '#004578',
        themeLight: '#c7e0f4',
        themeLighter: '#deecf9',
        themeLighterAlt: '#eff6fc',
        themePrimary: '#0074CC',
        themeSecondary: '#2b88d8',
        themeTertiary: '#71afe5',
        white: '#fff',
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
