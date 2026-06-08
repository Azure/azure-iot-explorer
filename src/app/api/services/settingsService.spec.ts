/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { THEME_SELECTION } from '../../constants/browserStorage';
import { Theme } from '../../shared/contexts/themeContext';
import { getDarkModeSetting, getHighContrastSetting, setDarkModeSetting } from './settingsService';
import * as interfaceUtils from '../shared/interfaceUtils';

describe('getDarkModeSettings', () => {
    it('returns expected setting when dark', () => {
        localStorage.setItem(THEME_SELECTION, Theme.dark);
        expect(getDarkModeSetting()).toEqual(true);
    });

    it('returns expected value when high contrast black', () => {
        localStorage.setItem(THEME_SELECTION, Theme.highContrastBlack);
        expect(getDarkModeSetting()).toEqual(true);
    });

    it('returns expected value when undefined', () => {
        localStorage.removeItem(THEME_SELECTION);
        // default matchMedia in jsdom doesn't match dark
        expect(getDarkModeSetting()).toEqual(false);
    });

    it('follows OS dark mode when no saved preference', () => {
        localStorage.removeItem(THEME_SELECTION);
        window.matchMedia = jest.fn().mockReturnValue({ matches: true });
        expect(getDarkModeSetting()).toEqual(true);
    });

    it('follows OS light mode when no saved preference', () => {
        localStorage.removeItem(THEME_SELECTION);
        window.matchMedia = jest.fn().mockReturnValue({ matches: false });
        expect(getDarkModeSetting()).toEqual(false);
    });
});

describe('setDarkModeSetting', () => {
    it('sets theme to dark', () => {
        localStorage.removeItem(THEME_SELECTION);
        setDarkModeSetting(true);

        expect(localStorage.getItem(THEME_SELECTION)).toEqual(Theme.dark);
    });

    it('sets theme to dark', () => {
        localStorage.removeItem(THEME_SELECTION);
        setDarkModeSetting(false);

        expect(localStorage.getItem(THEME_SELECTION)).toEqual(Theme.light);
    });
});

describe('getHighContrastSetting', () => {
    it('returns expected value', async () => {
        jest.spyOn(interfaceUtils, 'getSettingsInterface').mockReturnValue({
            useHighContrast: async () => Promise.resolve(true)
        });

        const result = await getHighContrastSetting();
        expect(result).toEqual(true);
    });
});
