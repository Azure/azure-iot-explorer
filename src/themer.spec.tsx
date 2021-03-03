/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Themer, getTheme } from './themer';
import { Theme, ThemeContextProvider } from './app/shared/contexts/themeContext';
import * as settingsService from './app/api/services/settingsService';

describe('getTheme', () => {
    it('returns expected theme when dark mode/ high contrast', () => {
        expect(getTheme(true, true)).toEqual(Theme.highContrastBlack);
    });

    it('returns expected theme when dark mode/normal contrast ', () => {
        expect(getTheme(true, false)).toEqual(Theme.dark);
    });

    it('returns expected theme when light mode /high contrast', () => {
        expect(getTheme(false, true)).toEqual(Theme.highContrastWhite);
    });

    it('returns expected theme when light mode / normal contrast', () => {
        expect(getTheme(false, false)).toEqual(Theme.light);
    });
});

describe('themer', () => {
    it('matches snapshot', () => {
        expect(shallow(<Themer/>)).toMatchSnapshot();
    });

    it('calls expected mmethods on mount', () => {
        const highContrastSpy = jest.spyOn(settingsService, 'getHighContrastSetting').mockResolvedValue(false);
        const darkMode = jest.spyOn(settingsService, 'getDarkModeSetting').mockReturnValue(false);

        mount(<Themer/>);
        expect(highContrastSpy).toHaveBeenCalled();
        expect(darkMode).toHaveBeenCalled();
    });

    it('calls expected mmethods on mount', () => {
        jest.spyOn(settingsService, 'getHighContrastSetting').mockResolvedValue(false);
        jest.spyOn(settingsService, 'getDarkModeSetting').mockReturnValue(false);

        const setDarkMode = jest.spyOn(settingsService, 'setDarkModeSetting');

        const component = shallow(<Themer/>);
        const contextProvider = component.find(ThemeContextProvider);
        contextProvider.props().value.updateTheme(true);

        expect(setDarkMode).toHaveBeenCalledWith(true);
    });
});
