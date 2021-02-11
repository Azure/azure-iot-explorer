/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { THEME_SELECTION } from '../../constants/browserStorage';
import { Theme } from '../../shared/contexts/themeContext';
import * as settingsService from './settingsService';

describe('getSettingsInterface', () => {
    it('returns expected data structure when browser mode', () => {
        appConfig.hostMode = HostMode.Browser;
        const factory = jest.spyOn(settingsService, 'getSettingsInterfaceForBrowser');

        settingsService.getSettingsInterface();
        expect(factory).toHaveBeenCalled();
    });

    it('returns expected data structure when electron mode', () => {
        appConfig.hostMode = HostMode.Electron;
        const factory = jest.spyOn(settingsService, 'getSettingsInterfaceForElectron');

        settingsService.getSettingsInterface();
        expect(factory).toHaveBeenCalled();
    });
});

describe('getDarkModeSettings', () => {
    it('returns expected setting when dark', () => {
        localStorage.setItem(THEME_SELECTION, Theme.dark);
        expect(settingsService.getDarkModeSetting()).toEqual(true);
    });

    it('returns expected value when high contrast black', () => {
        localStorage.setItem(THEME_SELECTION, Theme.highContrastBlack);
        expect(settingsService.getDarkModeSetting()).toEqual(true);
    });

    it('returns expected value when undefined', () => {
        localStorage.removeItem(THEME_SELECTION);
        expect(settingsService.getDarkModeSetting()).toEqual(false);
    });
});

describe('setDarkModeSetting', () => {
    it('sets theme to dark', () => {
        localStorage.removeItem(THEME_SELECTION);
        settingsService.setDarkModeSetting(true);

        expect(localStorage.getItem(THEME_SELECTION)).toEqual(Theme.dark);
    });

    it('sets theme to dark', () => {
        localStorage.removeItem(THEME_SELECTION);
        settingsService.setDarkModeSetting(false);

        expect(localStorage.getItem(THEME_SELECTION)).toEqual(Theme.light);
    });
});

describe('getHighContrastSetting', () => {
    it('returns expected value', () => {
        appConfig.hostMode = HostMode.Browser;
        expect(settingsService.getHighContrastSetting()).toEqual(settingsService.getSettingsInterfaceForBrowser().useHighContrast());
    });
});
