/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialDeviceEventsState, DeviceEventsStateInterface } from '../state';
import { DeviceEventsInterface } from './deviceEventsStateProvider';

export const getInitialDeviceEventsOps = (): DeviceEventsInterface => ({
    clearEventsMonitoring: () => undefined,
    setDecoderInfo: () => undefined,
    setDefaultDecodeInfo: () => undefined,
    setEvents: () => undefined,
    startEventsMonitoring: () => undefined,
    stopEventsMonitoring: () => undefined
});

export const DeviceEventsStateContext = React.createContext<[DeviceEventsStateInterface, DeviceEventsInterface]>
    ([
        getInitialDeviceEventsState(),
        getInitialDeviceEventsOps()
    ]);
export const useDeviceEventsStateContext = () => React.useContext(DeviceEventsStateContext);
