/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { THEME_SELECTION } from '../../constants/browserStorage';
import { Theme } from '../../shared/contexts/themeContext';
import { getDarkModeSetting, getHighContrastSetting, setDarkModeSetting } from './settingsService';
import { getSettingsInterfaceForBrowser } from '../shared/interfaceUtils';

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
    it('returns expected value', () => {
        appConfig.hostMode = HostMode.Browser;
        expect(getHighContrastSetting()).toEqual(getSettingsInterfaceForBrowser().useHighContrast());
    });
});
