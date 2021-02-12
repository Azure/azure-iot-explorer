/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { appConfig, HostMode } from '../../../appConfig/appConfig';
import * as interfaceUtils from './interfaceUtils';

describe('getSettingsInterface', () => {
    it('returns expected data structure when browser mode', () => {
        appConfig.hostMode = HostMode.Browser;
        const factory = jest.spyOn(interfaceUtils, 'getSettingsInterfaceForBrowser');

        interfaceUtils.getSettingsInterface();
        expect(factory).toHaveBeenCalled();
    });

    it('returns expected data structure when electron mode', () => {
        appConfig.hostMode = HostMode.Electron;
        const factory = jest.spyOn(interfaceUtils, 'getSettingsInterfaceForElectron');

        interfaceUtils.getSettingsInterface();
        expect(factory).toHaveBeenCalled();
    });
});
