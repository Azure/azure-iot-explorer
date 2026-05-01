/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { SystemPropertyCheckBox } from './systemPropertyCheckBox';
import { appConfig, HostMode } from '../../../../appConfig/appConfig';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';

import { render } from '@testing-library/react';
describe('SystemPropertyCheckBox', () => {
    it('matches snapshot', () => {
        appConfig.hostMode = HostMode.Electron;
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(render(
            <SystemPropertyCheckBox
            showSystemProperties={true}
            showPnpModeledEvents={true}
            setShowSystemProperties={jest.fn()}
            />)).toBeDefined();
    });
});
