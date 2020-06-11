/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { Themer } from './themer';
import { THEME_SELECTION, HIGH_CONTRAST } from './app/constants/browserStorage';
import { Theme, EditorTheme, ThemeContextProvider } from './app/shared/contexts/themeContext';
import { THEME_LIGHT, THEME_DARK, THEME_LIGHT_HC, THEME_DARK_HC } from './app/constants/themes';

describe('themer', () => {
    it('initializes to light theme when nothing in storage', () => {
        localStorage.removeItem(THEME_SELECTION);
        localStorage.removeItem(HIGH_CONTRAST);
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.light);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_LIGHT);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.light);
    });

    it('initializes to highContrastWhite when only high contrast is in storage', () => {
        localStorage.removeItem(THEME_SELECTION);
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.highContrastWhite);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_LIGHT_HC);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.hc_black);
    });

    it('initializes to light theme', () => {
        localStorage.setItem(THEME_SELECTION, 'light');
        localStorage.removeItem(HIGH_CONTRAST);
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.light);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_LIGHT);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.light);
    });

    it('initializes to dark theme', () => {
        localStorage.setItem(THEME_SELECTION, 'dark');
        localStorage.removeItem(HIGH_CONTRAST);
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.dark);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_DARK);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.dark);
    });

    it('initializes to high contrast white theme', () => {
        localStorage.setItem(THEME_SELECTION, 'highContrastWhite');
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.highContrastWhite);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_LIGHT_HC);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.hc_black);
    });

    it('initializes to high contrast black theme', () => {
        localStorage.setItem(THEME_SELECTION, 'highContrastBlack');
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.highContrastBlack);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_DARK_HC);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.hc_black);
    });

    it('initializes to high contrast white theme when light and high contrast', () => {
        localStorage.setItem(THEME_SELECTION, 'light');
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.highContrastWhite);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_LIGHT_HC);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.hc_black);
    });

    it('initializes to high contrast black theme when dark and high contrast', () => {
        localStorage.setItem(THEME_SELECTION, 'dark');
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.highContrastBlack);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_DARK_HC);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.hc_black);
    });

    it('reverts highContrastWhite to light theme when high contrast is false', () => {
        localStorage.setItem(THEME_SELECTION, 'highContrastWhite');
        localStorage.setItem(HIGH_CONTRAST, 'false');
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.light);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_LIGHT);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.light);
    });

    it('reverts highContrastBlack to dark theme when high contrast is false', () => {
        localStorage.setItem(THEME_SELECTION, 'highContrastBlack');
        localStorage.setItem(HIGH_CONTRAST, 'false');
        const component = shallow(<Themer />);
        const contextProvider = component.find(ThemeContextProvider);

        expect(contextProvider.props().value.theme).toEqual(Theme.dark);
        expect(contextProvider.props().value.fabricTheme).toEqual(THEME_DARK);
        expect(contextProvider.props().value.editorTheme).toEqual(EditorTheme.dark);
    });
});
