/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import { HIGH_CONTRAST } from '../../constants/browserStorage';
import { API_INTERFACES } from '../../../../public/constants';
import * as interfaceUtils from './interfaceUtils';

describe('getSettingsInterface', () => {
    it('returns expected data structure when browser mode', () => {
        appConfig.hostMode = HostMode.Browser;
        const factory = jest.spyOn(interfaceUtils, 'getSettingsInterfaceForBrowser');

        interfaceUtils.getSettingsInterface();
        expect(factory).toHaveBeenCalled();
    });

    it('calls expected factory when mode is electron', () => {
        appConfig.hostMode = HostMode.Electron;
        const factory = jest.spyOn(interfaceUtils, 'getElectronInterface');

        interfaceUtils.getSettingsInterface();
        expect(factory).toHaveBeenCalledWith(API_INTERFACES.SETTINGS);
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

describe('getDirectoryInterface', () => {
    it('calls expected factory when mode is electron', () => {
        appConfig.hostMode = HostMode.Electron;
        const factory = jest.spyOn(interfaceUtils, 'getElectronInterface');

        interfaceUtils.getDirectoryInterface()
        expect(factory).toHaveBeenLastCalledWith(API_INTERFACES.DIRECTORY);
    });
});

describe('getLocalModelRepositoryInterface', () => {
    it('calls expected factory when mode is electron', () => {
        appConfig.hostMode = HostMode.Electron;
        const factory = jest.spyOn(interfaceUtils, 'getElectronInterface');

        interfaceUtils.getLocalModelRepositoryInterface()
        expect(factory).toHaveBeenLastCalledWith(API_INTERFACES.MODEL_DEFINITION);
    });
});

