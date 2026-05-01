/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceTwin } from './deviceTwin';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { DeviceTwinStateInterface } from './../state';
import { getDeviceTwinAction, updateDeviceTwinAction } from '../actions';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';

describe('devices/components/deviceTwin', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DeviceTwin/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
