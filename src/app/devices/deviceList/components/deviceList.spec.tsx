/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceList } from './deviceList';
import { deviceListStateInitial, DeviceListStateInterface } from '../state';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import { DeviceListCommandBar } from './deviceListCommandBar';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { listDevicesAction } from '../actions';

describe('DeviceList', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DeviceList/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
