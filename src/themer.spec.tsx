/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render } from '@testing-library/react';
import { Themer, getTheme } from './themer';
import { Theme } from './app/shared/contexts/themeContext';
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
    it('renders without error', () => {
        jest.spyOn(settingsService, 'getHighContrastSetting').mockResolvedValue(false);
        jest.spyOn(settingsService, 'getDarkModeSetting').mockReturnValue(false);

        const { container } = render(<Themer/>);
        expect(container).toBeDefined();
    });

    it('calls settings services on mount', () => {
        const highContrastSpy = jest.spyOn(settingsService, 'getHighContrastSetting').mockResolvedValue(false);
        const darkMode = jest.spyOn(settingsService, 'getDarkModeSetting').mockReturnValue(false);

        render(<Themer/>);
        expect(highContrastSpy).toHaveBeenCalled();
        expect(darkMode).toHaveBeenCalled();
    });
});
