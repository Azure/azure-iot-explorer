/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { HIGH_CONTRAST } from '../../constants/browserStorage';
import { API_INTERFACES } from '../../../../public/constants';
import * as interfaceUtils from './interfaceUtils';

describe('getSettingsInterface', () => {
    it('calls expected factory when mode is electron', () => {
        const factory = jest.spyOn(interfaceUtils, 'getElectronInterface');

        interfaceUtils.getSettingsInterface();
        expect(factory).toHaveBeenCalledWith(API_INTERFACES.SETTINGS);
    });

    it('falls back to browser interface when electron interface is not available', () => {
        const originalApi = (window as any).api_settings;
        (window as any).api_settings = undefined;

        const result = interfaceUtils.getSettingsInterface();
        expect(result).toBeDefined();
        expect(typeof result.useHighContrast).toBe('function');

        (window as any).api_settings = originalApi;
    });
});

describe('browserSettingsApi', () => {
    it ('returns true when local storage is configured to true', async () => {
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const api = interfaceUtils.getSettingsInterfaceForBrowser();
        const result = await api.useHighContrast();

        expect(result).toEqual(true);
    })
    it ('resturns false when local storage is not true', async () => {
        localStorage.setItem(HIGH_CONTRAST, 'false');
        const api = interfaceUtils.getSettingsInterfaceForBrowser();
        const result = await api.useHighContrast();

        expect(result).toEqual(false);
    });
    it('returns false when local storage is not configured', async () => {
        localStorage.removeItem(HIGH_CONTRAST);
        const api = interfaceUtils.getSettingsInterfaceForBrowser();
        const result = await api.useHighContrast();

        expect(result).toEqual(false);
    });
});
